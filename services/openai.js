import axios from 'axios';
import config from '../config/index.js';

export const ROLE_SYSTEM = 'system';
export const ROLE_AI = 'assistant';
export const ROLE_HUMAN = 'user';

export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

export const IMAGE_SIZE_256 = '256x256';
export const IMAGE_SIZE_512 = '512x512';
export const IMAGE_SIZE_1024 = '1024x1024';

export const MODEL_GPT_3_5_TURBO = 'gpt-3.5-turbo';

const instance = axios.create({
  baseURL: 'https://api.openai.com',
  timeout: config.OPENAI_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

instance.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.OPENAI_API_KEY}`;
  return c;
});

const createChatCompletion = ({
  messages,
}) => instance.post('/v1/chat/completions', {
  model: 'gpt-3.5-turbo',
  messages,
});

const createTextCompletion = ({
  model = config.OPENAI_COMPLETION_MODEL,
  prompt,
  temperature = config.OPENAI_COMPLETION_TEMPERATURE,
  maxTokens = config.OPENAI_COMPLETION_MAX_TOKENS,
  frequencyPenalty = config.OPENAI_COMPLETION_FREQUENCY_PENALTY,
  presencePenalty = config.OPENAI_COMPLETION_PRESENCE_PENALTY,
  stop = [
    ` ${ROLE_AI}:`,
    ` ${ROLE_HUMAN}:`,
  ],
}) => instance.post('/v1/completions', {
  model,
  prompt,
  temperature,
  max_tokens: maxTokens,
  frequency_penalty: frequencyPenalty,
  presence_penalty: presencePenalty,
  stop,
});

const createImage = ({
  prompt,
  n = 1,
  size = IMAGE_SIZE_256,
}) => instance.post('/v1/images/generations', {
  prompt,
  n,
  size,
});

export {
  createChatCompletion,
  createTextCompletion,
  createImage,
};
