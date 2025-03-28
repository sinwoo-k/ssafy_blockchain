import { ethers } from 'ethers';
import AppError from '../../utils/AppError.js';

export async function getTransactionDetails(txHash) {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      throw new AppError("트랜잭션 영수증을 찾을 수 없습니다.", 404);
    }
    return receipt;
  } catch (error) {
    throw new AppError("트랜잭션 정보 조회 실패: " + error.message, 500);
  }
}

export default {
  getTransactionDetails,
};