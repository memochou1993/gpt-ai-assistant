import dotenv from 'dotenv';

dotenv.config();

const { env } = process;

class Config {
  constructor() {
    this.APP_ENV = env.APP_ENV || 'production';
    this.APP_DEBUG = env.APP_DEBUG === 'true' || false;
    this.APP_URL = env.APP_URL || null;
    this.APP_PORT = env.APP_PORT || null;
    this.OPENAI_API_KEY = env.OPENAI_API_KEY || null;
    this.OPENAI_COMPLETION_INIT_LANG = env.OPENAI_COMPLETION_INIT_LANG || 'zh';
    this.OPENAI_COMPLETION_MODEL = env.OPENAI_COMPLETION_MODEL || 'text-davinci-003';
    this.OPENAI_COMPLETION_TEMPERATURE = Number(env.OPENAI_COMPLETION_TEMPERATURE) || 0.9;
    this.OPENAI_COMPLETION_MAX_TOKENS = Number(env.OPENAI_COMPLETION_MAX_TOKENS) || 240;
    this.OPENAI_COMPLETION_FREQUENCY_PENALTY = Number(env.OPENAI_COMPLETION_FREQUENCY_PENALTY) || 0;
    this.OPENAI_COMPLETION_PRESENCE_PENALTY = Number(env.OPENAI_COMPLETION_PRESENCE_PENALTY) || 0.6;
    this.LINE_API_KEY = env.LINE_API_KEY || null;
    this.LINE_API_SECRET = env.LINE_API_SECRET || null;
  }

  get(key) {
    return this[key];
  }

  set(key, value) {
    switch (true) {
      case value === 'true' || value === 'false': {
        this[key] = value === 'true';
        break;
      }
      case !Number.isNaN(Number(value)): {
        this[key] = Number(value);
        break;
      }
      default:
        this[key] = value;
        break;
    }
  }
}

const config = new Config();

export default config;
