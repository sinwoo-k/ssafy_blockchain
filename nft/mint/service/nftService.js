import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pinataSDK from '@pinata/sdk';
import { getNftData } from '../repository/nftRepository.js';
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
async function uploadFileToPinata(fileBuffer) {
    try {
      const options = {
        pinataMetadata: {
          name: 'uploaded-file', // 원하는 파일 이름을 지정 (동적 이름 사용 가능)
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
 * @param {Object} params - { nftType, entityId, s3Url, toAddress }
 * @returns {Promise<Object>} 민팅 결과 (토큰 ID 및 메타데이터 URI 포함)
 */
export async function mintNftService({ nftType, entityId, s3Url, toAddress, originalCreator, registrant, adminWallet }) {
  try {
    // 1. 이미지 처리: S3 URL이 있으면 다운로드 후 Pinata에 업로드
    let imageUrl;
    if (s3Url) {
      const fileBuffer = await downloadFileFromS3(s3Url);
      imageUrl = await uploadFileToPinata(fileBuffer);
    } else {
      imageUrl = process.env.S3_DEFAULT_URL; // 기본 이미지 URL
    }

    // 2. 메타데이터 생성
    const metadata = {
      title: `${nftType} NFT #${entityId}`,
      description: `${nftType} 에 대한 NFT.`,
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
    const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTContract.json');
    const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
    const NFT_CONTRACT_ABI = nftArtifact.abi;
    const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
    
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, serverWallet);
    
    // 민팅 함수 호출: mint(toAddress, metadataUri)
    const tx = await nftContract.mint(toAddress, metadataUri);
    const receipt = await tx.wait();

    // 민팅 결과로 이벤트에서 tokenId 추출
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = nftContract.interface.parseLog(log);
        if (parsedLog.name === "NFTMinted") {
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (error) {
        // 이 로그는 NFTMinted 이벤트가 아닐 수 있으므로 무시
      }
    }

    return {
      nftId: entityId,
      tokenId,
      metadataUri,
      message: 'NFT 민팅이 완료되었습니다.'
    };
  } catch (error) {
    throw new AppError('NFT 민팅 중 오류가 발생했습니다: ' + error.message, 500);
  }
}

export async function getNftMetadata(tokenId) {
  try {
    // 온체인 데이터 조회
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS,
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
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
    };
  } catch (error) {
    throw new AppError(`NFT 조회 실패: ${error.message}`, 500);
  }
}


export default {
  mintNftService,
  getNftMetadata
};
