import express from 'express';
import { mintNftController, getNftDetails, buyNftController, listNftController, getAllNftsController, getMyNftsController } from '../controllers/nftController.js';
import { getIpfsImage } from '../controllers/ipfsController.js';

const router = express.Router();

router.post('/mint-nft', mintNftController);
router.get('/nft-details/:tokenId', getNftDetails);
router.get('/ipfs-image/:ipfsHash', getIpfsImage);
router.post('/buy-nft', buyNftController);
router.post('/sell-nft', listNftController);
router.get('/all-nfts', getAllNftsController);
router.get('/my-nfts', getMyNftsController);

export default router;
