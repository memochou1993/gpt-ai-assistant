import axios from 'axios';
import {
  OPENAI_API_KEY,
} from '../config/index.js';

export const PARTICIPANT_AI = 'AI';
export const PARTICIPANT_HUMAN = 'Human';
export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

const instance = axios.create({
  baseURL: 'https://api.openai.com',
  timeout: 10 * 1000,
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

export const complete = ({
  model = 'text-davinci-003',
  prompt,
  temperature = 0.9,
  maxTokens = 240,
  frequencyPenalty = 0,
  presencePenalty = 0.6,
  stop = [
    ` ${PARTICIPANT_AI}:`,
    ` ${PARTICIPANT_HUMAN}:`,
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
