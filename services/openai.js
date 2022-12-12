import axios from 'axios';
import {
  OPENAI_API_KEY,
  OPENAI_COMPLETION_MODEL,
  OPENAI_COMPLETION_TEMPERATURE,
  OPENAI_COMPLETION_MAX_TOKENS,
  OPENAI_COMPLETION_FREQUENCY_PENALTY,
  OPENAI_COMPLETION_PRESENCE_PENALTY,
} from '../config/index.js';

export const PARTICIPANT_AI = 'A';
export const PARTICIPANT_HUMAN = 'Q';
export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

const instance = axios.create({
  baseURL: 'https://api.openai.com',
  timeout: 60 * 1000,
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

export const complete = ({
  model = OPENAI_COMPLETION_MODEL,
  prompt,
  temperature = OPENAI_COMPLETION_TEMPERATURE,
  maxTokens = OPENAI_COMPLETION_MAX_TOKENS,
  frequencyPenalty = OPENAI_COMPLETION_FREQUENCY_PENALTY,
  presencePenalty = OPENAI_COMPLETION_PRESENCE_PENALTY,
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
