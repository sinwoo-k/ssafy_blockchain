// middleware/auth.js 
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: '토큰이 존재하지 않습니다' });
  }

  try {
    // Spring Boot와 동일한 시크릿 키 사용
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // 요청 객체에 사용자 정보 저장
    next();
  } catch (err) {
    return res.status(403).json({ error: '유효하지 않은 토큰' });
  }
};
