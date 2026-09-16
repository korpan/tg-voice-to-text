import axios from 'axios';
import fs from 'fs';
import fsPromises from 'fs/promises';
import FormData from 'form-data';
import { IVoiceProcessor } from '../../domain/services/IVoiceProcessor';
import { ITelegramFileDownloader } from '../../domain/services/ITelegramFileDownloader';
import { IAudioConverter } from '../../domain/services/IAudioConverter';
import { Config } from '../config/Config';

export class VoiceProcessor implements IVoiceProcessor {
  constructor(
    private fileDownloader: ITelegramFileDownloader,
    private audioConverter: IAudioConverter
  ) {}

  async process(fileId: string): Promise<string> {
    let downloadedPath: string | null = null;
    let convertedPath: string | null = null;

    try {
      // 1. Download the voice file
      downloadedPath = await this.fileDownloader.downloadFile(fileId);

      // Convert to 16-bit WAV (16kHz, mono, pcm_s16le)
      convertedPath = await this.audioConverter.convertToWav(downloadedPath);

      // 2. Send to Whisper Server via HTTP
      const serverUrl = Config.WHISPER_SERVER_URL;
      const form = new FormData();
      form.append('file', fs.createReadStream(convertedPath));
      form.append('language', 'auto')
      form.append('beam_size', 2)

      const response = await axios.post(`${serverUrl}/inference`, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const text = response.data.text;

      return text || 'No speech detected.';
    } catch (error) {
      console.error('Error in VoiceProcessor:', error);
      throw new Error(`Voice processing failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // 3. Cleanup the temporary files
      if (downloadedPath) {
        try {
          await fsPromises.unlink(downloadedPath);
        } catch (cleanupError) {
          console.error('Failed to cleanup downloaded file:', cleanupError);
        }
      }
      if (convertedPath) {
        try {
          await fsPromises.unlink(convertedPath);
        } catch (cleanupError) {
          console.error('Failed to cleanup converted file:', cleanupError);
        }
      }
    }
  }
}
