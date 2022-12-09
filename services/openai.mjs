import axios from 'axios';
import {
  OPENAI_API_KEY,
} from '../config/index.mjs';

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
  prompt,
}) => instance.post('/v1/completions', {
  model: 'text-davinci-003',
  prompt,
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: [
    ` ${PARTICIPANT_AI}:`,
    ` ${PARTICIPANT_HUMAN}:`,
  ],
});
