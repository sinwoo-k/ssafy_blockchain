import express from 'express';
import {
    mintNftController,
    getNftDetails,
    buyNftController,
    sellNftController,
    confirmSignatureController,
    metamaskMintRequestController,
    metamaskSellRequestController,
    metamaskBuyRequestController,
} from '../controllers/nftController.js';
import { getIpfsImage } from '../controllers/ipfsController.js';

const router = express.Router();

router.post('/mint-nft', mintNftController);
router.get('/nft-details/:tokenId', getNftDetails);
router.get('/ipfs-image/:ipfsHash', getIpfsImage);
router.post('/buy-nft', buyNftController);
router.post('/sell-nft', sellNftController);
// 2) 메타마스크 사용자용: 2단계로 분리
// ---- 민팅 ----
router.post('/metamask/mint-request', metamaskMintRequestController);
// ---- 판매 ----
router.post('/metamask/sell-request', metamaskSellRequestController);
// ---- 구매 ----
router.post('/metamask/buy-request', metamaskBuyRequestController);

router.post('/confirm-signature', confirmSignatureController);
export default router;
