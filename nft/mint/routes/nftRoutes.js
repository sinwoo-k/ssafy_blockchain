import express from 'express';
import { mintNftController, getNftDetails } from '../controller/nftController.js';
import { getIpfsImage } from '../controller/ipfsController.js';

const router = express.Router();

router.post('/mint-nft', mintNftController);
router.get('/nft-details/:tokenId', getNftDetails);
router.get('/ipfs-image/:ipfsHash', getIpfsImage);

export default router;
