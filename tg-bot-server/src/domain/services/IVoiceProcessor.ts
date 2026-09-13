export interface IVoiceProcessor {
  process(fileId: string): Promise<string>;
}
