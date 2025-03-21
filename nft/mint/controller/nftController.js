import { mintNftService, getNftMetadata } from '../service/nftService.js';
import AppError from '../../utils/AppError.js';

export async function mintNftController(req, res) {
    try {
        const { webtoonId, userId, type, typeId, s3Url, originalCreator, registrant} = req.body;

        // 필수 파라미터 확인
        if (!webtoonId || !userId || !type || !typeId) {
            return res.status(400).json({ error: 'webtoonId, userId, type, type_id는 필수입니다.' });
        }

        const result = await mintNftService({ webtoonId, userId, type, typeId, s3Url, originalCreator, registrant });
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

export async function listNftController(req, res) {
    try {
        const { tokenId, price } = req.body;

        // 필수 파라미터 확인
        if (!tokenId || !price) {
            return res.status(400).json({ error: 'tokenId와 price는 필수입니다.' });
        }

        const result = await listNftService({ tokenId, price });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 판매 등록 중 오류가 발생했습니다.' });
    }
}

export async function buyNftController(req, res) {
    try {
        const { tokenId } = req.body;

        // 필수 파라미터 확인
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId는 필수입니다.' });
        }

        const result = await buyNftService({ tokenId });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 구매 중 오류가 발생했습니다.' });
    }
}