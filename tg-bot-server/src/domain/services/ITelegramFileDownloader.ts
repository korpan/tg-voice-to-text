export interface ITelegramFileDownloader {
  downloadFile(fileId: string): Promise<string>;
}
