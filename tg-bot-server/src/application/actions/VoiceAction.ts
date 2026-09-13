import { IBotAction } from './IBotAction';
import { MessageRequest, MessageResponse } from '../types';
import { IVoiceProcessor } from '../../domain/services/IVoiceProcessor';

export class VoiceAction implements IBotAction {
  constructor(private voiceProcessor: IVoiceProcessor) {}

  async execute(request: MessageRequest): Promise<MessageResponse> {
    if (!request.voiceFileId) {
      return { text: 'No voice message found.' };
    }

    try {
      const transcription = await this.voiceProcessor.process(request.voiceFileId);
      return { text: `🎤 Voice transcription:\n\n${transcription}` };
    } catch (error) {
      console.error('Error processing voice message:', error);
      return { text: 'Sorry, I could not process the voice message.' };
    }
  }
}
