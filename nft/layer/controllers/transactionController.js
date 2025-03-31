import { getTransactionDetails } from '../services/transactionService.js';
import AppError from '../../utils/AppError.js';

export async function getTransactionDetailsController(req, res, next) {
  try {
    const { txHash } = req.params;
    if (!txHash) {
      throw new AppError("txHash가 필요합니다.", 400);
    }
    const receipt = await getTransactionDetails(txHash);
    res.status(200).json({
      status: 'success',
      data: receipt
    });
  } catch (error) {
    next(new AppError(`트랜잭션 정보 조회 실패: ${error.message}`, error.statusCode || 500));
  }
}

export default { getTransactionDetailsController };
