# 베이스 이미지는 Node.js LTS 버전 (예: 14-alpine)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 의존성 설치 캐싱 활용
COPY package*.json ./

# 프로덕션용 의존성 설치 (테스트용은 별도 처리 가능)
RUN npm install --production

# 앱 소스 복사
COPY . .

# Express.js 서버 포트 노출 (예: 3000)
EXPOSE 3000

# 앱 실행 (entrypoint는 server.js 혹은 app.js 등 실제 파일명으로 수정)
CMD ["node", "server.js"]
