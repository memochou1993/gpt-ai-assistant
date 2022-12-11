import dotenv from 'dotenv';

dotenv.config();

export const APP_ENV = process.env.APP_ENV || 'production';
export const APP_DEBUG = process.env.APP_DEBUG === 'true' || false;
export const APP_PORT = process.env.APP_PORT || 3000;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
export const OPENAI_COMPLETION_LANG = process.env.OPENAI_COMPLETION_LANG || 'zh';
export const LINE_API_KEY = process.env.LINE_API_KEY || null;
