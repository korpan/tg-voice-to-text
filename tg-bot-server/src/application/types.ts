export interface MessageRequest {
  userId: number;
  username?: string;
  text?: string;
  voiceFileId?: string;
}

export interface MessageResponse {
  text: string;
}
