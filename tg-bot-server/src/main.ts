import { Config } from './infrastructure/config/Config';
import { InMemoryUserRepository } from './infrastructure/repositories/InMemoryUserRepository';
import { VoiceProcessor } from './infrastructure/services/VoiceProcessor';
import { TelegramFileDownloader } from './infrastructure/services/TelegramFileDownloader';
import { FFmpegAudioConverter } from './infrastructure/services/FFmpegAudioConverter';
import { HandleMessageUseCase } from './application/use-cases/HandleMessageUseCase';
import { TelegramBotAdapter } from './infrastructure/bot/TelegramBotAdapter';
import { StartAction } from './application/actions/StartAction';
import { VoiceAction } from './application/actions/VoiceAction';
import { DefaultEchoAction } from './application/actions/DefaultEchoAction';

async function bootstrap() {
  try {
    // 1. Infrastructure: Services & Repositories
    const userRepository = new InMemoryUserRepository();
    const fileDownloader = new TelegramFileDownloader();
    const audioConverter = new FFmpegAudioConverter();
    const voiceProcessor = new VoiceProcessor(fileDownloader, audioConverter);

    // 2. Application: Actions
    const startAction = new StartAction();
    const voiceAction = new VoiceAction(voiceProcessor);
    const defaultAction = new DefaultEchoAction();

    // 3. Application: Use Case (The Router)
    const handleMessageUseCase = new HandleMessageUseCase(
      userRepository,
      startAction,
      voiceAction,
      defaultAction
    );

    // 4. Infrastructure: Bot Adapter
    const botToken = Config.TELEGRAM_BOT_TOKEN;
    const botAdapter = new TelegramBotAdapter(botToken, handleMessageUseCase);

    // Start the bot
    await botAdapter.start();

    process.once('SIGINT', () => botAdapter.stop());
    process.once('SIGTERM', () => botAdapter.stop());

  } catch (error) {
    console.error('Failed to bootstrap the bot:', error);
    process.exit(1);
  }
}

bootstrap();
