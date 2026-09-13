import dotenv from 'dotenv';

dotenv.config();

export class Config {
  public static get TELEGRAM_BOT_TOKEN(): string {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env file');
    }
    return token;
  }

  public static get WHISPER_SERVER_URL(): string {
    const url = process.env.WHISPER_SERVER_URL;
    if (!url) {
      // Default for local development
      return 'http://localhost:8080';
    }
    return url;
  }
}
