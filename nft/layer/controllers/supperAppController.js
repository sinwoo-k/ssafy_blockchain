import { ethers } from "ethers";
import AppError from "../../utils/AppError.js";
import {
  createWallet,
  registerNft,
  transferEther,
  listNft,
  getBalance,
  buyNft,
  getParsedTransactionLogsService,
  getNftTransfersService
} from "../services/superAppService.js"

// 1) 지갑 생성
export async function createWalletController(req, res, next) {
  try {
    const wallet = await createWallet();
    res.status(200).json({ success: true, wallet });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
}

export async function registerNftController(req, res, next) {
  try {
    const { privateKey, to } = req.body;
    let metadata = {};
    if (req.body.metadata) {
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch (error) {
        return next(new AppError("메타데이터 파싱 실패: " + error.message, 400));
      }
    }
    const file = req.file;
    if (!file) {
      throw new Error("파일이 제공되지 않았습니다.");
    }

    const { tokenId, tokenURI } = await registerNft(privateKey, to, file, metadata);

    res.status(200).json({ success: true, tokenId, tokenURI });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}


// 3) 이더 송금
export async function transferController(req, res, next) {
  try {
    const { privateKey, to, amount } = req.body;
    const tx = await transferEther(privateKey, to, amount);
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}

// 4) NFT 판매 등록
export async function listNftController(req, res, next) {
  try {
    const { privateKey, tokenId, price } = req.body;
    const tx = await listNft(privateKey, tokenId, price);
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}

// 5) 지갑 잔액 조회
export async function getBalanceController(req, res, next) {
  try {
    const { address } = req.params;
    const bal = await getBalance(address);
    res.status(200).json({ success: true, balance: bal });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}

// 6) NFT 구매
export async function buyNftController(req, res, next) {
  try {
    const { privateKey, tokenId, price } = req.body;
    const tx = await buyNft(privateKey, tokenId, price);
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}

// 7) 트랜잭션 로그 파싱
export async function getParsedTransactionLogsController(req, res, next) {
  try {
    const { txHash } = req.params;
    const logs = await getParsedTransactionLogsService(txHash);
    res.status(200).json({ success: true, logs });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}

// 8) 지갑 NFT 전송 이력
export async function getNftTransfersController(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const transfers = await getNftTransfersService(walletAddress);
    res.status(200).json({ success: true, transfers });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
}