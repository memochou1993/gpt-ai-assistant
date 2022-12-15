import axios from 'axios';
import config from '../../config/index.js';

export const EVENT_TYPE_MESSAGE = 'message';
export const MESSAGE_TYPE_TEXT = 'text';

const instance = axios.create({
  baseURL: 'https://api.line.me',
  timeout: 9 * 1000,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

instance.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.LINE_API_KEY}`;
  return c;
});

export const replyMessages = ({
  replyToken,
  messages,
}) => instance.post('/v2/bot/message/reply', {
  replyToken,
  messages,
});
