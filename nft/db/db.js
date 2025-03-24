import mysql from 'mysql2/promise';
import { createClient } from 'redis';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL || 'redis://j12c109.p.ssafy.io:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await redisClient.connect();


export { pool, redisClient };
