import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ITelegramFileDownloader } from '../../domain/services/ITelegramFileDownloader';
import { Config } from '../config/Config';

export class TelegramFileDownloader implements ITelegramFileDownloader {
  async downloadFile(fileId: string): Promise<string> {
    const token = Config.TELEGRAM_BOT_TOKEN;

    // 1. Get file path from Telegram API
    const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;
    const { data } = await axios.get(getFileUrl);

    if (!data.ok) {
      throw new Error(`Telegram getFile failed: ${data.description}`);
    }

    const filePath = data.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    // 2. Download the file to a temp directory
    const tempDir = os.tmpdir();
    const fileName = `${fileId}_${path.basename(filePath)}`;
    const fullPath = path.join(tempDir, fileName);

    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(fullPath));
      writer.on('error', reject);
    });
  }
}
