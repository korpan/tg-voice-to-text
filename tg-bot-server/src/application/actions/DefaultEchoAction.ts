import { IBotAction } from './IBotAction';
import { MessageRequest, MessageResponse } from '../types';

export class DefaultEchoAction implements IBotAction {
  async execute(request: MessageRequest): Promise<MessageResponse> {
    return { text: `You said: ${request.text}` };
  }
}
