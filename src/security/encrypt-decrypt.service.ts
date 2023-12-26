import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptDecryptService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = 'your_secret_key'; // Ваш секретный ключ
  private readonly iv = crypto.randomBytes(16); // Генерируем случайный IV для каждого шифрования

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedData: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}