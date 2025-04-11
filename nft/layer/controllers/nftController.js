import {
    mintNftService,
    getNftMetadata,
    sellNftService,
    buyNftService,
    confirmSignatureService,
    mintNftServiceMetamaskRequest,
    sellNftServiceMetamaskRequest,
    buyNftServiceMetamaskRequest,
} from '../services/nftService.js';
import AppError from '../../utils/AppError.js';


export async function mintNftController(req, res) {
    try {

        const { webtoonId, type, userId, typeId, s3Url, originalCreator, owner } = req.body;

        // 필수 파라미터 확인
        if (!webtoonId) {
            return res.status(400).json({ error: 'webtoonId는 필수입니다.' });
        } else if (!type) {
            return res.status(400).json({ error: 'type은 필수입니다.' });
        } else if (!typeId) {
            return res.status(400).json({ error: 'typeId는 필수입니다.' });
        } else if (!originalCreator) {
            return res.status(400).json({ error: 'originalCreator는 필수입니다.' });
        } else if (!owner) {
            return res.status(400).json({ error: 'owner 필수입니다.' });
        }

        const result = await mintNftService({ webtoonId, userId, type, typeId, s3Url, originalCreator, owner });
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

export async function sellNftController(req, res) {
    try {
        const { tokenId, price, userId } = req.body;

        // 필수 파라미터 확인
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId는 필수입니다.' });
        } else if (!price) {
            return res.status(400).json({ error: 'price는 필수입니다.' });
        }


        const result = await sellNftService({ tokenId, price, userId });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 판매 등록 중 오류가 발생했습니다.' });
    }
}

export async function buyNftController(req, res) {
    try {
        const { tokenId, price, userId } = req.body;

        // 필수 파라미터 확인
        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId는 필수입니다.' });
        } else if (!price) {
            return res.status(400).json({ error: 'price는 필수입니다.' });
        }

        const result = await buyNftService({ tokenId, price, userId });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message || 'NFT 구매 중 오류가 발생했습니다.' });
    }
}

export async function confirmSignatureController(req, res, next) {
    try {
        const { userId, signature } = req.body; // userId가 제대로 들어오는지 확인
        if (!userId) {
            return res.status(400).json({ error: 'userId는 필수입니다.' });
        }
        const result = await confirmSignatureService({ userId, signature });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function saleTransactionsController(req, res, next) {
    try {
        const { address } = req.params;
        if (!address) {
            return req.status(400).json({ error: '주소값은 필수입니다.' });
        }
        const result = await getSaleTransactions({ address });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function metamaskMintRequestController(req, res) {
    try {
        const { webtoonId, type, userId, typeId, s3Url, originalCreator, owner } = req.body;
        // 1) 필요한 파라미터 체크
        // 2) 메타마스크 Request 전용 서비스 호출
        const result = await mintNftServiceMetamaskRequest({
            webtoonId, type, userId, typeId, s3Url, originalCreator, owner
        });
        // 여기서 result에는 { needSignature:true, messageToSign:... } 가 포함될 것
        return res.json(result);
    } catch (err) {
        console.error('metamaskMintRequestController Error:', err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

// ----------------------- 판매 -----------------------
export async function metamaskSellRequestController(req, res) {
    try {
        const { tokenId, price, userId } = req.body;
        const result = await sellNftServiceMetamaskRequest({ tokenId, price, userId });
        return res.json(result);
    } catch (err) {
        console.error('metamaskSellRequestController Error:', err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}


// ----------------------- 구매 -----------------------
export async function metamaskBuyRequestController(req, res) {
    try {
        const { tokenId, price, userId } = req.body;
        const result = await buyNftServiceMetamaskRequest({ tokenId, price, userId });
        return res.json(result);
    } catch (err) {
        console.error('metamaskBuyRequestController Error:', err);
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}