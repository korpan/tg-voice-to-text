import { Telegraf } from 'telegraf';
import { HandleMessageUseCase } from '../../application/use-cases/HandleMessageUseCase';
import { MessageRequest } from '../../application/types';


export class TelegramBotAdapter {
  private bot: Telegraf;

  constructor(token: string, private handleMessageUseCase: HandleMessageUseCase) {
    this.bot = new Telegraf(token);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.bot.on('text', async (ctx) => {
      const request: MessageRequest = {
        userId: ctx.from.id,
        username: ctx.from.username,
        text: ctx.message.text,
      };

      try {
        const response = await this.handleMessageUseCase.execute(request);
        await ctx.reply(response.text);
      } catch (error) {
        console.error('Error handling message:', error);
        await ctx.reply('Something went wrong...');
      }
    });

    this.bot.on('voice', async (ctx) => {
      const request: MessageRequest = {
        userId: ctx.from.id,
        username: ctx.from.username,
        voiceFileId: ctx.message.voice.file_id,
      };

      try {
        const response = await this.handleMessageUseCase.execute(request);
        await ctx.reply(response.text);
      } catch (error) {
        console.error('Error handling voice message:', error);
        await ctx.reply('Something went wrong while processing your voice message...');
      }
    });
  }

  public async start(): Promise<void> {
    console.log('Bot is polling for updates...');
    await this.bot.launch();
  }

  public async stop(): Promise<void> {
    await this.bot.stop();
  }
}
