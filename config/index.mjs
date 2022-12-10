import dotenv from 'dotenv';

dotenv.config();

export const {
  APP_DEBUG,
  APP_PORT,
  OPENAI_API_KEY,
  LINE_API_KEY,
} = process.env;
