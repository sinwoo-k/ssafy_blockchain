import { mintNftService, getNftMetadata } from '../service/nftService.js';
import AppError from '../../utils/AppError.js';

export async function mintNftController(req, res) {
    try {
        const { nftType, entityId, s3Url, toAddress, originalCreator, registrant, adminWallet } = req.body;

        // 필수 파라미터 확인
        if (!nftType || !entityId || !toAddress || !originalCreator || !registrant || !adminWallet) {
            return res.status(400).json({ error: 'nftType, entityId, toAddress, originalCreator, registrant, 그리고 adminWallet는 필수입니다.' });
        }

        const result = await mintNftService({ nftType, entityId, s3Url, toAddress, originalCreator, registrant, adminWallet });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 민팅 중 오류가 발생했습니다.' });
    }
}

export const getNftDetails = async (req, res, next) => {
    try {
        const { tokenId } = req.params;
        const metadata = await getNftMetadata(tokenId);

        if (!metadata) {
            return next(new AppError('NFT not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: metadata
        });
    } catch (error) {
        next(new AppError(`NFT 조회 실패: ${error.message}`, 500));
    }
};