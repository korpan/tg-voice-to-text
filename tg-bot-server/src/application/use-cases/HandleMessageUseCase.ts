import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { MessageRequest, MessageResponse } from '../types';
import { IBotAction } from '../actions/IBotAction';

export class HandleMessageUseCase {
  constructor(
    private userRepository: IUserRepository,
    private startAction: IBotAction,
    private voiceAction: IBotAction,
    private defaultAction: IBotAction
  ) {}

  async execute(request: MessageRequest): Promise<MessageResponse> {
    const user: User = {
      id: request.userId,
      username: request.username,
      firstName: request.firstName,
      lastName: request.lastName,
      languageCode: request.languageCode,
    };


    await this.userRepository.saveUser(user);

    if (request.voiceFileId) {
      return this.voiceAction.execute(request);
    }

    if (request.text === '/start') {
      return this.startAction.execute(request);
    }

    return this.defaultAction.execute(request);
  }
}
