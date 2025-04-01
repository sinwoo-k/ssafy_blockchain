import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pinataSDK from '@pinata/sdk';
import {
  getWebtoonById,
  saveNftToDatabase,
  getEpisodeById, getFanartById,
  getGoodsById,
} from '../repositories/nftRepository.js';
import AppError from '../../utils/AppError.js';
import { ethers } from 'ethers';
import { Readable } from 'stream';
import { getWalletByUserId } from '../repositories/walletRepository.js';
import { encrypt, decrypt } from '../../cryptoHelper.js';
import { redisClient } from '../../db/db.js';
import { CONTRACT_CONFIG } from '../config/config.js';
const NFT_MARKETPLACE_ADDRESS = CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS;

// __dirname 대체 (ES Module 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function id(text) {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const ERC721_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Pinata 클라이언트 생성 (반드시 new 연산자를 사용)
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

export async function setChallenge(userId, challengeData) {
  const key = `Chaintoon::challenge:${userId}`;
  // Redis v4에서는 옵션 객체를 사용하여 EX 옵션을 지정할 수 있습니다.
  await redisClient.set(key, JSON.stringify(challengeData), { EX: 300 });
}

// 챌린지 조회
async function getChallenge(userId) {
  const key = `Chaintoon::challenge:${userId}`;
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

// 챌린지 삭제
async function deleteChallenge(userId) {
  const key = `Chaintoon::challenge:${userId}`;
  await redisClient.del(key);
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
    throw new AppError('S3 파일 다운로드 실패: ' + error.message, 500);
  }
}

/**
 * 파일 데이터를 Pinata에 업로드하고, IPFS 게이트웨이 URL을 반환하는 함수
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>} IPFS URL
 */
async function uploadFileToPinata(fileBuffer, name) {
  try {
    const options = {
      pinataMetadata: {
        name: name, // 원하는 파일 이름을 지정 (동적 이름 사용 가능)
      },
    };
    const readableStream = Readable.from(fileBuffer);
    const result = await pinata.pinFileToIPFS(readableStream, options);
    return `${process.env.IPFS_GATEWAY}${result.IpfsHash}`;
  } catch (error) {
    throw new AppError('Pinata 파일 업로드 실패: ' + error.message, 500);
  }
}


/**
 * JSON 데이터를 Pinata에 업로드하고, IPFS 게이트웨이 URL을 반환하는 함수
 * @param {Object} jsonData 
 * @returns {Promise<string>} IPFS URL
 */
async function uploadJSONToPinata(jsonData) {
  try {
    const result = await pinata.pinJSONToIPFS(jsonData);
    return `${process.env.IPFS_GATEWAY}${result.IpfsHash}`;
  } catch (error) {
    throw new AppError('Pinata JSON 업로드 실패: ' + error.message, 500);
  }
}

/**
 * NFT 민팅용 메타데이터를 생성하고, 스마트 컨트랙트를 통해 NFT 민팅을 진행하는 함수
 * @returns {Promise<Object>} 민팅 결과 (토큰 ID 및 메타데이터 URI 포함)
 */
export async function mintNftService({ webtoonId, userId, type, typeId, s3Url, originalCreator, registrant }) {
  try {
    let title;
    if (type == 'fanart') {
      const fanart = await getFanartById(typeId);
      title = fanart.fanart_name;
    } else if (type == 'goods') {
      const goods = await getGoodsById(typeId);
      title = goods.goods_name;
    } else if (type == 'episode') {
      const episode = await getEpisodeById(typeId);
      title = episode.episode_name;
    } else if (type == 'webtoon') {
      const webtoon = await getWebtoonById(webtoonId);
      title = webtoon.webtoon_name;
    } else {
      throw new AppError('type이 fanart, goods, episode 중 하나여야 합니다.', 400);
    }
    let webtoonName = await getWebtoonById(webtoonId);
    console.log(webtoonName.webtoon_name);
    const adminWallet = process.env.ADMIN_WALLET_ADDRESS;
    // 1. 이미지 처리: S3 URL이 있으면 다운로드 후 Pinata에 업로드
    const fileBuffer = await downloadFileFromS3(s3Url);
    const imageUrl = await uploadFileToPinata(fileBuffer, title);
    // 2. 메타데이터 생성
    const metadata = {
      title: `${title} NFT #${typeId}`,
      description: `${webtoonName.webtoon_name}에 대한 NFT.`,
      image: imageUrl,
      wallets: {
        originalCreator, // 원작자 코인 지갑 주소
        registrant,      // 등록자 코인 지갑 주소
        adminWallet,     // 관리자 코인 지갑 주소
      },
      revenueDistribution: {
        originalCreator: "4%",
        registrant: "95%",
        adminWallet: "1%",
      }
    };

    // 3. 메타데이터 JSON을 Pinata에 업로드
    const metadataUri = await uploadJSONToPinata(metadata);

    // 4. NFT 민팅 스마트 컨트랙트와 상호작용
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const NFT_MARKETPLACE_ABI = nftArtifact.abi;

    // 사용자의 지갑 정보
    const userWallet = await getWalletByUserId(userId);

    // DB에 사용자의 지갑 정보가 없을때
    if (!userWallet) {
      throw new AppError('해당 유저의 지갑 정보가 없습니다.', 404);
    }
    // 사용자의 지갑 정보가 있지만 개인키가 없을때
    let wallet;
    if (userWallet.private_key) {
      wallet = new ethers.Wallet(decrypt(userWallet.private_key), provider);
    } else {
      // wallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
      const messageToSign = `${userId}-${Date.now()}`;
      const challengeData = {
        message: messageToSign,
        operation: 'mint',
        extra: { webtoonId, type, typeId, s3Url, originalCreator, registrant, metadataUri }
      };
      await setChallenge(userId, challengeData);
      // 클라이언트는 반환받은 messageToSign에 대해 MetaMask로 서명 후,
      // confirmSignature API를 호출하여 거래 payload를 받아 직접 거래를 전송합니다.
      return { needSignature: true, messageToSign };
    }

    const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, wallet);

    // 실제 트랜잭션 실행: mint 함수 호출 후 receipt에서 이벤트 로그로 tokenId 추출
    const tx = await nftMarketplace.mint(
      registrant,
      metadataUri,
      originalCreator,
      registrant,
      adminWallet
    );
    const receipt = await tx.wait();
    // 8) 이벤트 파싱 (ethers v6 방식)
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = nftMarketplace.interface.parseLog(log);
        if (parsedLog.name === 'NFTMinted') {
          // 이벤트 인자에서 tokenId 추출
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (err) {
        // 해당 log가 NFTMarketplace의 이벤트가 아닐 경우 파싱 실패 -> 무시
      }
    }
    if (!tokenId) {
      throw new AppError('NFTMinted 이벤트를 찾을 수 없습니다.', 500);
    }
    const nftData = await saveNftToDatabase({
      webtoonId,
      userId,
      type,
      typeId,
      tokenId,
      contractAddress: NFT_MARKETPLACE_ADDRESS,
      metadataUri,
    });
    return { message: 'NFT 민팅 성공', tokenId, metadata };

  } catch (error) {
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
      contractAddress: NFT_MARKETPLACE_ADDRESS,
    };
  } catch (error) {
    throw new AppError(`NFT 조회 실패: ${error.message}`, 500);
  }
}

export async function sellNftService({ tokenId, price, userId }) {
  try {
    // NFT 스마트 컨트랙트 artifact 불러오기
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const NFT_MARKETPLACE_ABI = nftArtifact.abi;

    // price를 ETH 단위(소수)에서 Wei(BigInt)로 변환 (예: "0.001" -> 1e15)
    const priceWei = ethers.parseUnits(price.toString(), 'ether');


    // userId로 지갑 정보 조회
    const wallet = await getWalletByUserId(userId);

    let sellerWallet;
    if (wallet && wallet.private_key) {
      // DB에 privateKey가 존재하면 서버에서 트랜잭션 서명 진행
      const privateKey = decrypt(wallet.private_key);
      sellerWallet = new ethers.Wallet(privateKey, provider);
      const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, sellerWallet);

      // listNFT 트랜잭션 실행
      const tx = await nftMarketplace.listNFT(tokenId, priceWei);
      const receipt = await tx.wait();

      // 이벤트 NFTListed 파싱
      let listed = false;
      for (const log of receipt.logs) {
        try {
          const parsedLog = nftMarketplace.interface.parseLog(log);
          if (parsedLog.name === 'NFTListed') {
            listed = true;
            break;
          }
        } catch (err) {
          // 해당 로그가 NFTMarketplace의 이벤트가 아닐 경우 무시
        }
      }
      if (!listed) {
        throw new AppError('NFTListed 이벤트가 발생하지 않았습니다.', 500);
      }
      return { message: 'NFT 판매 등록 성공', tokenId, price: priceWei.toString() };
    } else {
      // DB에 privateKey가 없는 경우 => MetaMask 연동된 계정으로 진행
      // MetaMask에서 서명할 수 있도록 거래에 필요한 파라미터(payload) 생성
      // 여기서는 거래 데이터를 미리 준비해 둡니다.
      const iface = new ethers.Interface(NFT_MARKETPLACE_ABI);
      // listNFT 함수에 대한 데이터 인코딩
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
        extra: { tokenId: tokenId, price, priceWei: priceWei.toString(), metamaskPayload }
      };
      await setChallenge(userId, challengeData);
      return { needSignature: true, messageToSign };
    }
  } catch (error) {
    throw new AppError(`NFT 판매 등록 실패: ${error.message}`, 500);
  }
}

export async function buyNftService({ tokenId, price, userId }) {
  try {
    // NFT 스마트 컨트랙트 artifact 불러오기
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const NFT_MARKETPLACE_ABI = nftArtifact.abi;

    // price를 ETH 단위에서 Wei(BigInt)로 변환
    const priceWei = ethers.parseUnits(price.toString(), 'ether');


    // userId로 지갑 정보 조회
    const wallet = await getWalletByUserId(userId);

    let buyerWallet;
    if (wallet && wallet.private_key) {
      // DB에 privateKey가 존재하면 서버에서 트랜잭션 서명 진행
      buyerWallet = new ethers.Wallet(decrypt(wallet.private_key), provider);
      const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, buyerWallet);

      // buyNFT 트랜잭션 실행 (판매 가격만큼 value 전송)
      const tx = await nftMarketplace.buyNFT(tokenId, { value: priceWei });
      const receipt = await tx.wait();

      // 이벤트 NFTSold 파싱
      let sold = false;
      for (const log of receipt.logs) {
        try {
          const parsedLog = nftMarketplace.interface.parseLog(log);
          if (parsedLog.name === 'NFTSold') {
            sold = true;
            break;
          }
        } catch (err) {
          // 해당 로그가 NFTMarketplace의 이벤트가 아닐 경우 무시
        }
      }
      if (!sold) {
        throw new AppError('NFTSold 이벤트가 발생하지 않았습니다.', 500);
      }
      return { message: 'NFT 구매 성공', tokenId };
    } else {
      // 구매용 챌린지 생성
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
    throw new AppError(`NFT 구매 실패: ${error.message}`, 500);
  }
}


// MetaMask 서명 검증 및 트랜잭션 진행
export async function confirmSignatureService({ userId, signature }) {
  console.log("userId:", userId);
  const challengeData = await getChallenge(userId);
  if (!challengeData) {
    throw new AppError('서명 요청 정보가 존재하지 않습니다.', 400);
  }
  const { message, operation, extra } = challengeData;
  const userWallet = await getWalletByUserId(userId);
  if (!userWallet || !userWallet.wallet_address) {
    throw new AppError('해당 유저의 지갑 정보가 없습니다.', 404);
  }
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log("message:", message);
    console.log("signature:", signature);
    console.log("recoveredAddress:", recoveredAddress);
    if (!recoveredAddress || recoveredAddress.toLowerCase() !== userWallet.wallet_address.toLowerCase()) {
      throw new AppError('서명이 유효하지 않습니다.', 400);
    }
    await deleteChallenge(userId);

    // 스마트 컨트랙트 아티팩트 로드
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const iface = new ethers.Interface(nftArtifact.abi);

    if (operation === 'mint') {
      const metamaskPayload = {
         to: NFT_MARKETPLACE_ADDRESS,
         data: iface.encodeFunctionData('mint', [
             extra.registrant,
             extra.metadataUri,
             extra.originalCreator,
             extra.registrant,
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
         data: iface.encodeFunctionData('buyNFT', [ extra.tokenId ]),
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
      // sendTransaction 작업은 단순 ETH 송금을 위한 거래 payload 생성
      // extra에는 toAddress와 amountWei (송금할 금액의 wei 값)가 포함되어 있다고 가정합니다.
      const metamaskPayload = {
        to: extra.toAddress,
        value: extra.amountWei, // 이미 문자열 형식으로 wei 값이어야 함
        // 추가 가스 옵션이 필요하면 여기서 설정 가능
      };
      return {
        success: true,
        message: '서명이 확인되었습니다. 송금 거래를 진행하세요.',
        operation,
        metamaskPayload
      };
    } else {
      return { success: true, message: '서명이 확인되었습니다.', operation, contractAddress: NFT_MARKETPLACE_ADDRESS, extra };
    }
  } catch (error) {
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
};
