import { MessageRequest, MessageResponse } from '../types';

export interface IBotAction {
  execute(request: MessageRequest): Promise<MessageResponse>;
}
