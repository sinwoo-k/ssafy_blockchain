import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY; // 32바이트 (64자리 16진수)

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(data) {
  const [ivHex, encrypted] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
