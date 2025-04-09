import axios from 'axios';
import pinataSDK from '@pinata/sdk';
import {
  getWebtoonById,
  saveNftToDatabase,
  getEpisodeById, getFanartById,
  getGoodsById,
  getNftCountByTypeId,
} from '../repositories/nftRepository.js';
import AppError from '../../utils/AppError.js';
import { ethers } from 'ethers';
import { Readable } from 'stream';
import { getWalletByAddress, getWalletByUserId } from '../repositories/walletRepository.js';
import { encrypt, decrypt } from '../../cryptoHelper.js';
import { redisClient } from '../../db/db.js';
import { NFT_MARKETPLACE_ABI, NFT_MARKETPLACE_ADDRESS, RPC_URL } from '../config/contract.js';

function id(text) {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Pinata 클라이언트 생성 (반드시 new 연산자를 사용)
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

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
 * NFT 민팅용 메타데이터를 생성하고, 스마트 컨트랙트를 통해 NFT 민팅을 진행하는 함수
 * @returns {Promise<Object>} 민팅 결과 (토큰 ID 및 메타데이터 URI 포함)
 */
export async function mintNftService({ webtoonId, userId, type, typeId, s3Url, originalCreator, owner }) {
  try {
    const ownerId = await getWalletByAddress(owner);
    if (ownerId.user_id != userId) {
      throw new AppError("작성자의 지갑과 유저의 아이디가 다릅니다.", 403);
    }
    let title;
    if (type === 'fanart') {
      const fanart = await getFanartById(typeId);
      if (fanart == null) {
        throw new AppError("해당하는 펜아트가 없습니다.", 404);
      }
      if (fanart?.user_id != userId) {
        throw new AppError("펜아트의 작성자만 등록 할 수 있습니다.", 403);
      }
      title = fanart.fanart_name;
    } else if (type === 'goods') {
      const goods = await getGoodsById(typeId);
      if (goods == null) {
        throw new AppError("해당하는 굿즈가 없습니다.", 404);
      }
      if (goods?.user_id != userId) {
        throw new AppError("굿즈의 작성자만 등록 할 수 있습니다.", 403);
      }
      title = goods.goods_name;
    } else if (type === 'episode') {
      const episode = await getEpisodeById(typeId);
      if (episode == null) {
        throw new AppError("해당하는 에피소드가 없습니다.", 404);
      }
      title = episode.episode_name;
    } else {
      throw new AppError('type은 fanart, goods, episode 중 하나여야 합니다.', 400);
    }
    let webtoonName = await getWebtoonById(webtoonId);
    if (webtoonName == null) {
      throw new AppError("해당하는 웹툰이 없습니다.", 404);
    }
    const adminWallet = process.env.ADMIN_WALLET_ADDRESS;

    // 1. 이미지 처리: S3 URL이 있으면 다운로드 후 Pinata에 업로드
    const fileBuffer = await downloadFileFromS3(s3Url);
    const imageUrl = await uploadFileToPinata(fileBuffer, title);
    const nftNumber = await getNftCountByTypeId(type, typeId);
    // 2. 메타데이터 생성
    const metadata = {
      title: `${title} NFT #${nftNumber + 1}`,
      description: `${webtoonName.webtoon_name}에 대한 NFT.`,
      image: imageUrl,
    };

    // 3. 메타데이터 JSON을 Pinata에 업로드
    const metadataUri = await uploadJSONToPinata(metadata);

    // 4. NFT 민팅 스마트 컨트랙트와 상호작용


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
      // 사용자 서명을 통한 민팅 처리
      const messageToSign = `${userId}-${Date.now()}`;
      const challengeData = {
        message: messageToSign,
        operation: 'mint',
        extra: { webtoonId, type, typeId, s3Url, originalCreator, owner, metadataUri }
      };
      await setChallenge(userId, challengeData);
      return { needSignature: true, messageToSign };
    }

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
    const nftData = await saveNftToDatabase({
      webtoonId,
      userId,
      type,
      typeId,
      tokenId,
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
      const iface = new ethers.Interface(NFT_MARKETPLACE_ABI);
      const data = iface.encodeFunctionData('listNFT', [tokenId, priceWei]);
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data,
        value: "0"
      };
      const messageToSign = `${userId}-${Date.now()}`;
      const challengeData = {
        message: messageToSign,
        operation: 'sell',
        extra: { tokenId, price, priceWei: priceWei.toString(), metamaskPayload }
      };
      await setChallenge(userId, challengeData);
      return { needSignature: true, messageToSign };
    }
  } catch (error) {
    console.error(`sellNftService Error: ${error.stack}`);
    throw new AppError(`NFT 판매 등록 실패: ${error.message}`, 500);
  }
}

export async function buyNftService({ tokenId, price, userId }) {
  try {
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
      const messageToSign = `${userId}-${Date.now()}`;
      const challengeData = {
        message: messageToSign,
        operation: 'buy',
        extra: { tokenId, price, priceWei: priceWei.toString() }
      };
      await setChallenge(userId, challengeData);
      return { needSignature: true, messageToSign };
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

    const iface = new ethers.Interface(nftArtifact.abi);

    if (operation === 'mint') {
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data: iface.encodeFunctionData('mint', [
          extra.owner,
          extra.metadataUri,
          extra.originalCreator,
          extra.owner,
          process.env.ADMIN_WALLET_ADDRESS
        ]),
        value: "0"
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 민팅 거래를 진행하세요.',
        operation,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        metamaskPayload
      };
    } else if (operation === 'sell') {
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data: iface.encodeFunctionData('listNFT', [
          extra.tokenId,
          extra.priceWei
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
      const metamaskPayload = {
        to: NFT_MARKETPLACE_ADDRESS,
        data: iface.encodeFunctionData('buyNFT', [extra.tokenId]),
        value: extra.priceWei
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 구매 거래를 진행하세요.',
        operation,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        metamaskPayload
      };
    } else if (operation === 'sendTransaction') {
      const metamaskPayload = {
        to: extra.toAddress,
        value: extra.amountWei,
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 송금 거래를 진행하세요.',
        operation,
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


export default {
  mintNftService,
  getNftMetadata,
  sellNftService,
  buyNftService,
  confirmSignatureService,
  setChallenge,
  uploadFileToPinata,
  uploadJSONToPinata,
};