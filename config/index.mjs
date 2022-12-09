import dotenv from 'dotenv';

dotenv.config();

export const { APP_ENV } = process.env;
export const { APP_PORT } = process.env;
export const { OPENAI_API_KEY } = process.env;
export const { LINE_API_KEY } = process.env;
