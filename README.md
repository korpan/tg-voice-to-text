# Voice to Text Bot

A Telegram bot that transcribes voice messages using whisper.cpp.

## Setup
1. Download a whisper.cpp model:
```bash
docker compose run --rm whisper-server ./models/download-ggml-model.sh base /models
```
2. Add `TELEGRAM_BOT_TOKEN` to `tg-bot-server/.env`.

## Run
Run `docker compose up -d --build`.
