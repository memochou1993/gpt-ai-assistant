import dotenv from 'dotenv';

dotenv.config();

const { env } = process;

export const APP_ENV = env.APP_ENV || 'production';
export const APP_DEBUG = env.APP_DEBUG === 'true' || false;
export const APP_PORT = env.APP_PORT || 3000;

export const OPENAI_API_KEY = env.OPENAI_API_KEY || null;
export const OPENAI_COMPLETION_LANG = env.OPENAI_COMPLETION_LANG || 'zh';
export const OPENAI_COMPLETION_MODEL = env.OPENAI_COMPLETION_MODEL || 'text-davinci-003';
export const OPENAI_COMPLETION_TEMPERATURE = env.OPENAI_COMPLETION_TEMPERATURE || 0.9;
export const OPENAI_COMPLETION_MAX_TOKENS = env.OPENAI_COMPLETION_MAX_TOKENS || 240;
export const OPENAI_COMPLETION_FREQUENCY_PENALTY = env.OPENAI_COMPLETION_FREQUENCY_PENALTY || 0;
export const OPENAI_COMPLETION_PRESENCE_PENALTY = env.OPENAI_COMPLETION_PRESENCE_PENALTY || 0.6;

export const LINE_API_KEY = env.LINE_API_KEY || null;
