import axios from 'axios';
import pinataSDK from '@pinata/sdk';
import {
  getWebtoonById,
  saveNftToDatabase,
  getEpisodeById, getFanartById,
  getGoodsById,
  getNftCountByTypeId,
  updateNftUserId,
} from '../repositories/nftRepository.js';
import AppError from '../../utils/AppError.js';
import { ethers } from 'ethers';
import { Readable } from 'stream';
import { getWalletByAddress, getWalletByUserId } from '../repositories/walletRepository.js';
import { encrypt, decrypt } from '../../cryptoHelper.js';
import { redisClient } from '../../db/db.js';
import { NFT_MARKETPLACE_ABI, NFT_MARKETPLACE_ADDRESS, RPC_URL } from '../config/contract.js';
import { getWalletInfoService } from './walletService.js'
import { title } from 'process';
function id(text) {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Pinata 클라이언트 생성 (반드시 new 연산자를 사용)
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);
async function checkWalletBalance(userId, requiredBalance = 0.01) {
  const walletInfo = await getWalletInfoService({ userId });
  // balances.eth 값이 "0.5 ETH"와 같이 문자열인 경우 처리
  if (!walletInfo || !walletInfo.balances || !walletInfo.balances.eth) {
    throw new AppError('지갑 잔액 정보를 가져올 수 없습니다.', 400);
  }
  const ethStr = walletInfo.balances.eth.replace(' ETH', '').trim();
  const balance = parseFloat(ethStr);
  if (isNaN(balance) || balance < requiredBalance) {
    throw new AppError('ETH 잔고가 부족합니다.', 400);
  }
  return balance;
}
export async function setChallenge(userId, challengeData) {
  const key = `Chaintoon::challenge:${userId}`;
  try {
    await redisClient.set(key, JSON.stringify(challengeData), { EX: 300 });
  } catch (error) {
    console.error(`setChallenge Error: ${error.stack}`);
    throw new AppError('챌린지 저장 실패', 500);
  }
}
// 챌린지 조회
async function getChallenge(userId) {
  const key = `Chaintoon::challenge:${userId}`;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`getChallenge Error: ${error.stack}`);
    throw new AppError('챌린지 조회 실패', 500);
  }
}
// 챌린지 삭제
async function deleteChallenge(userId) {
  const key = `Chaintoon::challenge:${userId}`;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`deleteChallenge Error: ${error.stack}`);
    throw new AppError('챌린지 삭제 실패', 500);
  }
}
/**
 * S3 URL에서 파일을 다운로드하여 Buffer로 반환
 * @param {string} s3Url - S3 또는 이미지 URL
 * @returns {Promise<Buffer>} 파일 데이터
 */
async function downloadFileFromS3(s3Url) {
  try {
    const response = await axios.get(s3Url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`downloadFileFromS3 Error: ${error.stack}`);
    throw new AppError('S3 파일 다운로드 실패: ' + error.message, 500);
  }
}
/**
 * 파일 데이터를 Pinata에 업로드하고, IPFS 게이트웨이 URL을 반환하는 함수
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>} IPFS URL
 */
export async function uploadFileToPinata(fileBuffer, name) {
  try {
    const options = {
      pinataMetadata: {
        name: name,
      },
    };
    const readableStream = Readable.from(fileBuffer);
    const result = await pinata.pinFileToIPFS(readableStream, options);
    return `${process.env.IPFS_GATEWAY}${result.IpfsHash}`;
  } catch (error) {
    console.error(`uploadFileToPinata Error: ${error.stack}`);
    throw new AppError('Pinata 파일 업로드 실패: ' + error.message, 500);
  }
}

/**
 * JSON 데이터를 Pinata에 업로드하고, IPFS 게이트웨이 URL을 반환하는 함수
 * @param {Object} jsonData 
 * @returns {Promise<string>} IPFS URL
 */
export async function uploadJSONToPinata(jsonData) {
  try {
    const result = await pinata.pinJSONToIPFS(jsonData);
    return `${process.env.IPFS_GATEWAY}${result.IpfsHash}`;
  } catch (error) {
    console.error(`uploadJSONToPinata Error: ${error.stack}`);
    throw new AppError('Pinata JSON 업로드 실패: ' + error.message, 500);
  }
}

/**
 * 민팅 전 DB 검증 & Pinata 업로드 & 메타데이터 생성
 *  - webtoonId, fanart/goods/episode 여부에 따라 title 추출
 *  - S3에서 이미지 다운로드 → Pinata 업로드
 *  - 메타데이터(JSON) Pinata 업로드 → metadataUri 리턴
 */
async function validateAndUploadForMint({ webtoonId, type, typeId, userId, s3Url, originalCreator, owner }) {
  // 1) ownerAddress → DB 지갑 userId 매칭
  const ownerWallet = await getWalletByAddress(owner);
  if (!ownerWallet || ownerWallet.user_id !== userId) {
    throw new AppError('작성자의 지갑 주소와 유저 정보가 일치하지 않습니다.', 403);
  }

  // 2) 작품/아이템 존재 여부 + 작성자 여부
  let title;
  if (type === 'fanart') {
    const fanart = await getFanartById(typeId);
    if (!fanart) throw new AppError('해당 펜아트가 존재하지 않습니다.', 404);
    if (fanart.user_id !== userId) {
      throw new AppError('펜아트의 작성자만 NFT 등록할 수 있습니다.', 403);
    }
    title = fanart.fanart_name;
  } else if (type === 'goods') {
    const goods = await getGoodsById(typeId);
    if (!goods) throw new AppError('해당 굿즈가 존재하지 않습니다.', 404);
    if (goods.user_id !== userId) {
      throw new AppError('굿즈의 작성자만 NFT 등록할 수 있습니다.', 403);
    }
    title = goods.goods_name;
  } else if (type === 'episode') {
    const episode = await getEpisodeById(typeId);
    if (!episode) throw new AppError('해당 에피소드가 존재하지 않습니다.', 404);
    // episode는 작성자 체크가 필요없다면 스킵 or if (episode.user_id !== userId) ...
    title = episode.episode_name;
  } else {
    throw new AppError('type은 fanart, goods, episode 중 하나여야 합니다.', 400);
  }

  const webtoon = await getWebtoonById(webtoonId);
  if (!webtoon) {
    throw new AppError('해당 웹툰이 존재하지 않습니다.', 404);
  }

  // 3) S3 → Pinata
  const fileBuffer = await downloadFileFromS3(s3Url);
  const imageUrl = await uploadFileToPinata(fileBuffer, title);

  // 4) 메타데이터 생성
  const nftNumber = await getNftCountByTypeId(type, typeId);
  const metadata = {
    title: `${title} NFT #${nftNumber + 1}`,
    description: `${webtoon.webtoon_name}에 대한 NFT.`,
    image: imageUrl,
  };

  // 5) 메타데이터 JSON → Pinata
  const metadataUri = await uploadJSONToPinata(metadata);

  return {
    imageUrl,
    metadataUri,
    metadata
  };
}
/**
 * NFT 민팅용 메타데이터를 생성하고, 스마트 컨트랙트를 통해 NFT 민팅을 진행하는 함수
 * @returns {Promise<Object>} 민팅 결과 (토큰 ID 및 메타데이터 URI 포함)
 */
export async function mintNftService({ webtoonId, userId, type, typeId, s3Url, originalCreator, owner }) {

  try {
    await checkWalletBalance(userId, 0.01);

    const { imageUrl, metadataUri, metadata } = await validateAndUploadForMint({ webtoonId, type, typeId, userId, s3Url, originalCreator, owner });
    // 사용자의 지갑 정보
    const userWallet = await getWalletByUserId(userId);
    if (!userWallet) {
      throw new AppError('해당 유저의 지갑 정보가 없습니다.', 404);
    }
    let wallet;
    if (userWallet.private_key) {
      try {
        wallet = new ethers.Wallet(decrypt(userWallet.private_key), provider);
      } catch (decryptError) {
        console.error(`Wallet Decrypt Error: ${decryptError.stack}`);
        throw new AppError('지갑 복호화에 실패했습니다.', 500);
      }
    } else {
      throw new AppError('지갑 정보가 없습니다.', 404);
    }
    const adminWallet = process.env.ADMIN_WALLET_ADDRESS;

    const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, wallet);

    // 실제 트랜잭션 실행: mint 함수 호출
    const tx = await nftMarketplace.mint(
      owner,
      metadataUri,
      originalCreator,
      adminWallet
    );
    const receipt = await tx.wait();

    // 이벤트 파싱 (ethers v6 방식)
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = nftMarketplace.interface.parseLog(log);
        if (parsedLog.name === 'Minted') {
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (parseError) {
        // 해당 로그가 NFTMarketplace 이벤트가 아닐 경우 무시
      }
    }
    if (!tokenId) {
      throw new AppError('Minted 이벤트를 찾을 수 없습니다.', 500);
    }
    console.log("그냥 민팅 title: ", metadata.title);
    const nftData = await saveNftToDatabase({
      webtoonId,
      userId,
      type,
      typeId,
      tokenId,
      title: metadata.title,
      imageUrl,
      contractAddress: NFT_MARKETPLACE_ADDRESS,
      metadataUri,
    });
    return { status: 'success', tokenId, metadata };
  } catch (error) {
    console.error(`mintNftService Error: ${error.stack}`);
    throw new AppError('NFT 민팅 중 오류가 발생했습니다: ' + error.message, 500);
  }
}

export async function getNftMetadata(tokenId) {
  try {
    // 온체인 데이터 조회
    const contract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      ['function tokenURI(uint256) view returns (string)'],
      provider
    );
    const tokenURI = await contract.tokenURI(tokenId);

    // 오프체인 메타데이터 조회
    const metadataResponse = await axios.get(tokenURI);
    const metadata = metadataResponse.data;
    return {
      tokenId,
      ...metadata,
    };
  } catch (error) {
    console.error(`getNftMetadata Error: ${error.stack}`);
    throw new AppError(`NFT 조회 실패: ${error.message}`, 500);
  }
}

export async function sellNftService({ tokenId, price, userId }) {
  try {
    await checkWalletBalance(userId, 0.01);

    const priceWei = ethers.parseUnits(price.toString(), 'ether');

    const wallet = await getWalletByUserId(userId);
    let sellerWallet;
    if (wallet && wallet.private_key) {
      try {
        sellerWallet = new ethers.Wallet(decrypt(wallet.private_key), provider);
      } catch (decryptError) {
        console.error(`Wallet Decrypt Error: ${decryptError.stack}`);
        throw new AppError('지갑 복호화에 실패했습니다.', 500);
      }
      const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, sellerWallet);
      const tx = await nftMarketplace.listNFT(tokenId, priceWei);
      const receipt = await tx.wait();

      let listed = false;
      for (const log of receipt.logs) {
        try {
          const parsedLog = nftMarketplace.interface.parseLog(log);
          if (parsedLog.name === 'NFTListed') {
            listed = true;
            break;
          }
        } catch (parseError) {
          // 해당 로그가 NFTMarketplace 이벤트가 아닐 경우 무시
        }
      }
      if (!listed) {
        throw new AppError('NFTListed 이벤트가 발생하지 않았습니다.', 500);
      }
      return { message: 'NFT 판매 등록 성공', tokenId, price: priceWei.toString() };
    } else {
      throw new AppError('지갑 정보가 없습니다.', 404);
    }
  } catch (error) {
    console.error(`sellNftService Error: ${error.stack}`);
    throw new AppError(`NFT 판매 등록 실패: ${error.message}`, 500);
  }
}

export async function buyNftService({ tokenId, price, userId }) {
  try {
    await checkWalletBalance(userId, 0.01);

    const priceWei = ethers.parseUnits(price.toString(), 'ether');

    const wallet = await getWalletByUserId(userId);
    let buyerWallet;
    if (wallet && wallet.private_key) {
      try {
        buyerWallet = new ethers.Wallet(decrypt(wallet.private_key), provider);
      } catch (decryptError) {
        console.error(`Wallet Decrypt Error: ${decryptError.stack}`);
        throw new AppError('지갑 복호화에 실패했습니다.', 500);
      }
      const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, buyerWallet);
      const tx = await nftMarketplace.buyNFT(tokenId, { value: priceWei });
      const receipt = await tx.wait();

      let soldEvent = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = nftMarketplace.interface.parseLog(log);
          if (parsedLog.name === 'NFTSold') {
            // 예: event NFTSold(uint256 tokenId, address buyer, address seller, uint256 price);
            soldEvent = {
              tokenId: parsedLog.args.tokenId.toString(),
              buyer: parsedLog.args.buyer,
              seller: parsedLog.args.seller,
              priceWei: parsedLog.args.price.toString(),
            };
            break;
          }
        } catch (parseError) {
          // ignore non-related logs
        }
      }
      if (!soldEvent) {
        throw new AppError('NFTSold 이벤트가 발생하지 않았습니다.', 500);
      }

      const royaltyInfo = await nftMarketplace.royaltyInfoByToken(soldEvent.tokenId);
      const originalCreator = royaltyInfo.originalCreator;
      const prevOwner = royaltyInfo.ownerShare; // buyNFT가 끝난 시점엔 이미 업데이트 되었을 수도 있으니 주의
      // 총 거래 금액(Wei)
      const totalPaidWei = BigInt(soldEvent.priceWei);
      // 4%, 95%, 1% 계산
      const originalCreatorShareWei = (totalPaidWei * 4n) / 100n;
      const prevOwnerShareWei = (totalPaidWei * 95n) / 100n;

      // Wei → Ether(소수점 5자리)
      const soldPriceEther = parseFloat(ethers.formatEther(totalPaidWei)).toFixed(5);
      const originalCreatorShareEther = parseFloat(ethers.formatEther(originalCreatorShareWei)).toFixed(5);
      const prevOwnerShareEther = parseFloat(ethers.formatEther(prevOwnerShareWei)).toFixed(5);
      console.log("soldPriceEther:", soldPriceEther);
      console.log("originalCreatorShareEther:", originalCreatorShareEther);

      updateNftUserId(soldEvent.tokenId, userId);
      return {
        message: 'NFT 구매 성공',
        tokenId: soldEvent.tokenId,
        // 구매자 / 판매자
        buyer: soldEvent.buyer,
        seller: soldEvent.seller,

        // 전체 판매금액
        soldPriceEther,

        // 로열티 주소
        originalCreator,
        prevOwner,       // 이번에 판 사람과 같을 것

        // 실제 분배 금액
        originalCreatorShareEther,
        prevOwnerShareEther,
      };
    } else {
      throw new AppError('지갑 정보가 없습니다.', 404);
    }
  } catch (error) {
    console.error(`buyNftService Error: ${error.stack}`);
    throw new AppError(`NFT 구매 실패: ${error.message}`, 500);
  }
}

export async function confirmSignatureService({ userId, signature }) {
  console.log("userId:", userId);
  try {
    const challengeData = await getChallenge(userId);
    if (!challengeData) {
      throw new AppError('서명 요청 정보가 존재하지 않습니다.', 400);
    }
    const { message, operation, extra } = challengeData;
    const userWallet = await getWalletByUserId(userId);
    if (!userWallet || !userWallet.wallet_address) {
      throw new AppError('해당 유저의 지갑 정보가 없습니다.', 404);
    }
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log("message:", message);
    console.log("signature:", signature);
    console.log("recoveredAddress:", recoveredAddress);
    if (!recoveredAddress || recoveredAddress.toLowerCase() !== userWallet.wallet_address.toLowerCase()) {
      throw new AppError('서명이 유효하지 않습니다.', 400);
    }
    await deleteChallenge(userId);

    const iface = new ethers.Interface(NFT_MARKETPLACE_ABI);

    if (operation === 'mint') {
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data: iface.encodeFunctionData('mint', [
          extra.owner,
          extra.metadataUri,
          extra.originalCreator,
          process.env.ADMIN_WALLET_ADDRESS
        ]),
        value: "0"
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 민팅 거래를 진행하세요.',
        operation,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        metamaskPayload,
        imageUrl: extra.imageUrl,       // 추가된 필드
        metadataUri: extra.metadataUri,  // 추가된 필드
        title: extra.title,         // 추가된 필드
      };
    } else if (operation === 'sell') {
      const priceBigNumber = ethers.parseUnits(extra.price, "ether"); // 변환한 BigNumber
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data: iface.encodeFunctionData('listNFT', [
          extra.tokenId,
          priceBigNumber
        ]),
        value: "0"
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 판매 거래를 진행하세요.',
        operation,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        metamaskPayload
      };
    } else if (operation === 'buy') {
      // 구매의 경우에도 price 값을 동일하게 변환해서 사용
      const priceBigNumber = ethers.parseUnits(extra.price, "ether");
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data: iface.encodeFunctionData('buyNFT', [extra.tokenId]),
        value: priceBigNumber.toString()
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 구매 거래를 진행하세요.',
        operation,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        metamaskPayload
      };
    } else {
      return {
        success: true,
        message: '서명이 확인되었습니다.',
        operation,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        extra
      };
    }
  } catch (error) {
    console.error(`confirmSignatureService Error: ${error.stack}`);
    throw new AppError('서명 검증 및 거래 진행 중 오류가 발생했습니다: ' + error.message, 500);
  }
}

// --------------------- 민팅 ---------------------
export async function mintNftServiceMetamaskRequest({
  webtoonId, type, userId, typeId, s3Url, originalCreator, owner
}) {
  await checkWalletBalance(userId, 0.01);

  // 1) Pinata 업로드 결과 얻기
  const { imageUrl, metadataUri, metadata } = await validateAndUploadForMint({
    webtoonId, type, userId, typeId, s3Url, originalCreator, owner
  });
  // 2) Redis에 nonce/message + meta 정보
  const messageToSign = `${userId}-${Date.now()}`;
  const challengeData = {
    message: messageToSign,
    operation: 'mint',
    extra: {
      webtoonId: webtoonId,          // 웹툰 ID
      type: type,                    // NFT 타입 (예: fanart, goods, episode)
      typeId: typeId,                // 실제 아이템 ID
      s3Url: s3Url,                  // 원본 S3 URL
      originalCreator: originalCreator,  // 원작자
      owner: owner,                      // NFT 소유자 (지갑 주소)
      metadataUri: metadataUri,          // Pinata에 업로드한 메타데이터 URI
      imageUrl: imageUrl,                // Pinata에 업로드한 이미지 URL
      title: metadata.title                       // 계산된 title 값
    }
  };
  await setChallenge(userId, challengeData);

  return {
    needSignature: true,
    messageToSign
  };
}


// --------------------- 판매 ---------------------
export async function sellNftServiceMetamaskRequest({ tokenId, price, userId }) {

  // 1) DB 검증, 소유권 확인
  // 2) nonce 생성
  const messageToSign = `${userId}-${Date.now()}`;
  const challengeData = {
    message: messageToSign,
    operation: 'sell',
    extra: { tokenId, price }
  };
  console.log("challengeData:", challengeData);
  await setChallenge(userId, challengeData);
  return { needSignature: true, messageToSign };
}


// --------------------- 구매 ---------------------
export async function buyNftServiceMetamaskRequest({ tokenId, price, userId }) {

  // 1) DB 확인
  // 2) nonce
  const messageToSign = `${userId}-${Date.now()}`;
  const challengeData = {
    message: messageToSign,
    operation: 'buy',
    extra: { tokenId, price }
  };
  await setChallenge(userId, challengeData);

  return { needSignature: true, messageToSign };
}
export default {
  mintNftService,
  getNftMetadata,
  sellNftService,
  buyNftService,
  confirmSignatureService,
  setChallenge,
  uploadFileToPinata,
  uploadJSONToPinata,
  mintNftServiceMetamaskRequest,
  sellNftServiceMetamaskRequest,
  buyNftServiceMetamaskRequest,
};