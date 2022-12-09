import { Configuration, OpenAIApi } from 'openai';
import config from '../config/index.mjs';

export const TITLE_AI = 'AI';
export const TITLE_HUMAN = 'Human';
export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const prompt = (context) => openai.createCompletion({
  model: 'text-davinci-003',
  prompt: context,
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: [
    ` ${TITLE_AI}:`,
    ` ${TITLE_HUMAN}:`,
  ],
});
