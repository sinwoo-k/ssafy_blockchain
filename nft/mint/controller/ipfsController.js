import axios from 'axios';

export async function getIpfsImage(req, res) {
  try {
    const { ipfsHash } = req.params;
    // 환경 변수에 설정된 IPFS 게이트웨이 URL과 결합
    const ipfsUrl = `${process.env.IPFS_GATEWAY}${ipfsHash}`;
    
    // IPFS 게이트웨이에서 이미지 데이터를 다운로드 (arraybuffer 형태)
    const response = await axios.get(ipfsUrl, { responseType: 'arraybuffer' });
    
    // Content-Type 헤더 설정 후 클라이언트에 전송
    res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.send(response.data);
  } catch (error) {
    console.error("IPFS 이미지 로딩 실패: ", error.message);
    res.status(500).json({ error: 'IPFS 이미지 로딩에 실패했습니다.' });
  }
}