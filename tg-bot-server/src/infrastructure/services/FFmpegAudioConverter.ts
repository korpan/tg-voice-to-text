import { exec } from 'child_process';
import { promisify } from 'util';
import { IAudioConverter } from '../../domain/services/IAudioConverter';

const execPromise = promisify(exec);

export class FFmpegAudioConverter implements IAudioConverter {
  async convertToWav(inputPath: string): Promise<string> {
    const convertedPath = `${inputPath}.wav`;
    // Convert to 16-bit WAV (16kHz, mono, pcm_s16le)
    await execPromise(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${convertedPath}" -y`);
    return convertedPath;
  }
}
