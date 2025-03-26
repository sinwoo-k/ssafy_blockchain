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
  getNftById
} from '../repositories/nftRepository.js';
import AppError from '../../utils/AppError.js';
import { ethers } from 'ethers';
import { Readable } from 'stream';

// __dirname 대체 (ES Module 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Pinata 클라이언트 생성 (반드시 new 연산자를 사용)
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

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
async function uploadFileToPinata(fileBuffer,name) {
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
    let webtoonName = await getWebtoonById(webtoonId).webtoonName;
    const adminWallet = process.env.ADMIN_WALLET_ADDRESS;
    // 1. 이미지 처리: S3 URL이 있으면 다운로드 후 Pinata에 업로드
    const fileBuffer = await downloadFileFromS3(s3Url);
    const imageUrl = await uploadFileToPinata(fileBuffer,title);
   // 2. 메타데이터 생성
    const metadata = {
      title: `${title} NFT #${typeId}`,
      description: `${webtoonName}에 대한 NFT.`,
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
    const NFT_MARKETPLACE_ADDRESS = process.env.NFT_MARKETPLACE_ADDRESS;

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
    const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, serverWallet);

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
      contractAddress: process.env.NFT_MARKETPLACE_ADDRESS,
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
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.NFT_MARKETPLACE_ADDRESS,
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
      contractAddress: process.env.NFT_MARKETPLACE_ADDRESS,
    };
  } catch (error) {
    throw new AppError(`NFT 조회 실패: ${error.message}`, 500);
  }
}

/**
 * NFT 판매(listNFT) 함수
 * @param {number} tokenId 판매할 NFT의 토큰ID
 * @param {string|number} price 판매 가격(ETH 단위로 입력)
 * @param {string} privateKey 판매자 지갑 프라이빗키
 */
export async function listNftService({ tokenId, price, privateKey }) {
  try {
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const NFT_MARKETPLACE_ABI = nftArtifact.abi;
    const NFT_MARKETPLACE_ADDRESS = process.env.NFT_MARKETPLACE_ADDRESS;

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    // 판매자 지갑
    const sellerWallet = new ethers.Wallet(privateKey, provider);
    // const adminWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
    const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, sellerWallet);

    // ─────────────────────────────────────────────────────────
    // 1) price를 ETH 단위(소수)에서 Wei(BigInt)로 변환
    //    예) "0.001" -> 1000000000000000 (1e15)
    // ─────────────────────────────────────────────────────────
    const priceWei = ethers.parseUnits(price.toString(), 'ether');

    // 2) listNFT 트랜잭션
    const tx = await nftMarketplace.listNFT(tokenId, priceWei);
    const receipt = await tx.wait();

    // 3) 로그 파싱 (이벤트 NFTListed)
    let listed = false;
    for (const log of receipt.logs) {
      try {
        const parsedLog = nftMarketplace.interface.parseLog(log);
        if (parsedLog.name === 'NFTListed') {
          listed = true;
          break;
        }
      } catch (err) {
        // 무시
      }
    }

    if (!listed) {
      throw new AppError('NFTListed 이벤트가 발생하지 않았습니다.', 500);
    }

    return { message: 'NFT 판매 등록 성공', tokenId, price: priceWei.toString() };
  } catch (error) {
    throw new AppError(`NFT 판매 등록 실패: ${error.message}`, 500);
  }
}

/**
 * NFT 구매(buyNFT) 함수
 * @param {number} tokenId 구매할 NFT의 토큰ID
 * @param {string|number} price 지불 금액(wei)
 * @param {string} privateKey 구매자 지갑 프라이빗키
 */
export async function buyNftService({ tokenId, price, privateKey }) {
  try {
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const NFT_MARKETPLACE_ABI = nftArtifact.abi;
    const NFT_MARKETPLACE_ADDRESS = process.env.NFT_MARKETPLACE_ADDRESS;

    const priceWei = ethers.parseUnits(price.toString(), 'ether');

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    // 구매자 지갑
    const buyerWallet = new ethers.Wallet(privateKey, provider);
    const nftMarketplace = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, buyerWallet);

    // buyNFT 트랜잭션 (판매 가격만큼 value로 전송)
    const tx = await nftMarketplace.buyNFT(tokenId, {
      value: priceWei
    });
    const receipt = await tx.wait();

    // 로그 파싱 (이벤트 NFTSold)
    let sold = false;
    for (const log of receipt.logs) {
      try {
        const parsedLog = nftMarketplace.interface.parseLog(log);
        if (parsedLog.name === 'NFTSold') {
          sold = true;
          break;
        }
      } catch (err) {
        // 무시
      }
    }

    if (!sold) {
      throw new AppError('NFTSold 이벤트가 발생하지 않았습니다.', 500);
    }

    return { message: 'NFT 구매 성공', tokenId };
  } catch (error) {
    throw new AppError(`NFT 구매 실패: ${error.message}`, 500);
  }
}

export default {
  mintNftService,
  getNftMetadata,
  listNftService,
  buyNftService,
};
