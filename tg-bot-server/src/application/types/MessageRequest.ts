export interface MessageRequest {
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  text?: string;
  voiceFileId?: string;
}
