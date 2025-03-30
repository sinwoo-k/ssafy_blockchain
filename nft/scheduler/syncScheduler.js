import cron from 'node-cron';
import { syncNewTransactions } from '../layer/services/transactionService.js';

// 환경 변수나 별도 설정으로 동기화할 컨트랙트 주소를 지정합니다.
const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
if (!contractAddress) {
  console.error("환경 변수 CONTRACT_ADDRESS가 설정되지 않았습니다.");
  process.exit(1);
}

// 매 시간 0분마다 실행하도록 스케줄링 (즉, 매 정시에 동기화 실행)
cron.schedule('0 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] 자동 동기화 시작...`);
  try {
    const result = await syncNewTransactions(contractAddress);
    console.log(`[${new Date().toISOString()}] 동기화 결과:`, result);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 동기화 에러:`, error);
  }
});

console.log("1시간마다 자동 동기화 스케줄러가 시작되었습니다.");
