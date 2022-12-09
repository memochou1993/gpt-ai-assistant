import dotenv from 'dotenv';

dotenv.config();

const config = Object.freeze({
  APP_ENV: process.env.APP_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  LINE_API_KEY: process.env.LINE_API_KEY,
});

export default config;
