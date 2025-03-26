import { mintNftService, getNftMetadata, listNftService, buyNftService, getMyNftsService } from '../services/nftService.js';
import AppError from '../../utils/AppError.js';


export async function mintNftController(req, res) {
    try {
        const userId = req.user.sub;

        const { webtoonId, type, typeId, s3Url, originalCreator, registrant} = req.body;

        // 필수 파라미터 확인
        if (!webtoonId ) {
            return res.status(400).json({ error: 'webtoonId는 필수입니다.' });
        } else if (!type) {
            return res.status(400).json({ error: 'type은 필수입니다.' });
        } else if (!typeId) {
            return res.status(400).json({ error: 'typeId는 필수입니다.' });
        } else if (!originalCreator) {
            return res.status(400).json({ error: 'originalCreator는 필수입니다.' });
        } else if (!registrant) {
            return res.status(400).json({ error: 'registrant는 필수입니다.' });
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
        const { tokenId, price, privateKey } = req.body;

        // 필수 파라미터 확인
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId는 필수입니다.' });
        } else if (!price) {
            return res.status(400).json({ error: 'price는 필수입니다.' });
        }


        const result = await listNftService({ tokenId, price , privateKey});
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 판매 등록 중 오류가 발생했습니다.' });
    }
}

export async function buyNftController(req, res) {
    try {
        const { tokenId, price, privateKey } = req.body;

        // 필수 파라미터 확인
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId는 필수입니다.' });
        } else if (!price) {
            return res.status(400).json({ error: 'price는 필수입니다.' });
        }

        const result = await buyNftService({ tokenId, price , privateKey});
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 구매 중 오류가 발생했습니다.' });
    }
}

export async function getMyNftsController(req, res, next) {
    try {
      // 예시: 인증 미들웨어에서 req.user에 사용자 정보가 담겨 있다고 가정
      const userId = req.user.id;
      const nfts = await getMyNftsService(userId);
      res.status(200).json({ nfts });
    } catch (error) {
      next(error);
    }
  }

  export async function getAllNftsController(req, res, next) {
    try {
      const nfts = await getAllNftsService();
      res.status(200).json({ nfts });
    } catch (error) {
      next(error);
    }
  }