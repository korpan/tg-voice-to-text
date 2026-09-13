import axios from 'axios';
import fs from 'fs';
import fsPromises from 'fs/promises';
import FormData from 'form-data';
import { IVoiceProcessor } from '../../domain/services/IVoiceProcessor';
import { ITelegramFileDownloader } from '../../domain/services/ITelegramFileDownloader';
import { Config } from '../config/Config';

export class VoiceProcessor implements IVoiceProcessor {
  constructor(private fileDownloader: ITelegramFileDownloader) {}

  async process(fileId: string): Promise<string> {
    let downloadedPath: string | null = null;

    try {
      // 1. Download the voice file
      downloadedPath = await this.fileDownloader.downloadFile(fileId);

      // 2. Send to Whisper Server via HTTP
      const serverUrl = Config.WHISPER_SERVER_URL;
      const form = new FormData();
      form.append('file', fs.createReadStream(downloadedPath));

      const response = await axios.post(`${serverUrl}/inference`, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const text = response.data.text || response.data;

      return text || 'No speech detected.';
    } catch (error) {
      console.error('Error in VoiceProcessor:', error);
      throw new Error(`Voice processing failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // 3. Cleanup the temporary file
      if (downloadedPath) {
        try {
          await fsPromises.unlink(downloadedPath);
        } catch (cleanupError) {
          console.error('Failed to cleanup temp file:', cleanupError);
        }
      }
    }
  }
}
