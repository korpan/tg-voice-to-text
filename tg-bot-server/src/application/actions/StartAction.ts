import { IBotAction } from './IBotAction';
import { MessageRequest, MessageResponse } from '../types';

export class StartAction implements IBotAction {
  async execute(request: MessageRequest): Promise<MessageResponse> {
    return { text: 'Welcome to the Voice to Text Bot!' };
  }
}
