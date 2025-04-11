import { ethers } from "ethers";
import {
  bcGetTransactionReceipt,
  getWalletNftTransfers
} from '../repositories/transactionRepository.js';
import {
  SUPPER_APP_NFT_ABI,
  SUPPER_APP_NFT_ADDRESS,
  WALLET_CONTRACT_ABI,
  WALLET_CONTRACT_ADDRESS,
  SERVER_PRIVATE_KEY
} from '../config/contract.js';
import {
  uploadFileToPinata,
  uploadJSONToPinata,
} from './nftService.js';
// import { fallbackProvider as provider } from '../config/provider.js';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const serverWallet = new ethers.Wallet(SERVER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  SUPPER_APP_NFT_ADDRESS,
  SUPPER_APP_NFT_ABI,
  provider
);
const walletManagerContract = new ethers.Contract(
  WALLET_CONTRACT_ADDRESS,
  WALLET_CONTRACT_ABI,
  serverWallet
);

/** 1) Wallet 생성 */
export async function createWallet() {
  const newWallet = ethers.Wallet.createRandom();
  const walletAddress = newWallet.address;
  const privateKey = newWallet.privateKey;
  const publicKey = newWallet.publicKey;
  const recoveryPhrase = newWallet.mnemonic.phrase;

  console.log(`Wallet Address: ${walletAddress}`);
  console.log(`Private Key: ${privateKey}`);
  console.log(`Public Key: ${publicKey}`);
  console.log(`Recovery Phrase: ${recoveryPhrase}`);

  try {
    const tx = await walletManagerContract.adminRegisterWallet(
      walletAddress,
      publicKey
    );
    await tx.wait();
  } catch (err) {
    // on‑chain 등록 실패 시, DB 저장 취소 로직이 필요하다면 추가하세요
    throw new AppError('온체인 지갑 등록 실패: ' + err.message, 500);
  }

  return {
    walletAddress,
    publicKey,
    privateKey,
    recoveryPhrase,
  };
}

export async function registerNft(pk, to, file, metadata = {}) {
  console.log('Received file:', file);
  if (!file || !file.buffer || !file.originalname) {
    throw new Error("올바른 파일 데이터가 제공되지 않았습니다.");
  }

  // 파일 업로드 후 이미지 URL 획득
  const imageUrl = await uploadFileToPinata(file.buffer, file.originalname);
  metadata = {
    ...metadata,
    image: imageUrl
  };

  // 메타데이터를 JSON으로 업로드 후 tokenURI 생성
  const tokenURI = await uploadJSONToPinata(metadata);
  const wallet = new ethers.Wallet(pk, provider);

  // NFT를 등록하는 스마트 컨트랙트 함수 호출
  const tx = await contract.connect(wallet).registerNFT(to, tokenURI);
  const receipt = await tx.wait();

  let tokenId;
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog.name === 'NFTRegistered') {
        tokenId = parsedLog.args.tokenId.toString();
        break;
      }
    } catch (error) {
      console.error('로그 파싱 실패:', error.message);
    }
  }

  console.log(`Token ID: ${tokenId}`);
  console.log('Transaction Hash:', receipt.transactionHash);

  return { tokenId, tokenURI };
}



/** 3) 이더 송금 */
export async function transferEther(pk, to, amount) {
  const wallet = new ethers.Wallet(pk, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount.toString())
  });
  return tx.wait();
}

/** 4) NFT 판매 등록 */
export async function listNft(pk, tokenId, price) {
  const wallet = new ethers.Wallet(pk, provider);
  const tx = await contract.connect(wallet).listNFT(tokenId, ethers.parseEther(price.toString()));
  return tx.wait();
}

/** 5) 지갑 잔액 조회 */
export async function getBalance(address) {
  return (await provider.getBalance(address)).toString();
}

/** 6) NFT 구매 */
export async function buyNft(pk, tokenId, price) {
  const wallet = new ethers.Wallet(pk, provider);
  const tx = await contract.connect(wallet).buyNFT(tokenId, { value: ethers.parseEther(price.toString()) });
  return tx.wait();
}

/** 7) txHash 로그 파싱 */
export async function getParsedTransactionLogsService(txHash) {
  const receipt = await bcGetTransactionReceipt(txHash);
  const iface = new ethers.Interface(SUPPER_APP_NFT_ABI);
  return receipt.logs.map(log => {
    const topic0 = log.topics[0];
    const fragment = Object.values(iface.events)
      .find(f => iface.getEventTopic(f) === topic0);
    if (fragment) {
      const parsed = iface.parseLog(log);
      const args = {};
      fragment.inputs.forEach((i, idx) => {
        args[i.name] = parsed.args[idx].toString();
      });
      return {
        event: fragment.name,
        address: log.address,
        args,
        from: args.from || null,
        to: args.to || null,
      };
    } else {
      return { event: null, address: log.address, topics: log.topics };
    }
  });
}

/** 8) NFT 전송 이력 */
export async function getNftTransfersService(walletAddress) {
  const raw = await getWalletNftTransfers(walletAddress, 0, 'latest');
  return raw.map(tx => ({
    blockNumber: tx.blockNumber,
    txHash: tx.transactionHash,
    from: tx.from,
    to: tx.to,
    tokenId: tx.tokenID,
    timestamp: tx.timeStamp
  }));
}