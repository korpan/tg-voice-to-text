export interface IAudioConverter {
  convertToWav(inputPath: string): Promise<string>;
}
