import axios from 'axios';
import config from '../config/index.mjs';

const instance = axios.create({
  baseURL: 'https://api.line.me',
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${config.LINE_API_KEY}`,
  },
});

/**
 * @param {string} replyToken
 * @param {Array<Object>} messages
 * @param {string} messages[].type
 * @param {string} messages[].text
 */
export const reply = ({
  replyToken,
  messages,
}) => instance.post('/v2/bot/message/reply', {
  replyToken,
  messages,
});

export default null;
