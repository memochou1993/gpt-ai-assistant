import axios from 'axios';
import config from '../config/index.js';

export const EVENT_TYPE_MESSAGE = 'message';
export const EVENT_TYPE_POSTBACK = 'postback';

export const SOURCE_TYPE_USER = 'user';
export const SOURCE_TYPE_GROUP = 'group';

export const MESSAGE_TYPE_TEXT = 'text';
export const MESSAGE_TYPE_IMAGE = 'image';
export const MESSAGE_TYPE_TEMPLATE = 'template';

export const TEMPLATE_TYPE_BUTTONS = 'buttons';

export const ACTION_TYPE_MESSAGE = 'message';
export const ACTION_TYPE_POSTBACK = 'postback';

export const QUICK_REPLY_TYPE_ACTION = 'action';

const instance = axios.create({
  baseURL: 'https://api.line.me',
  timeout: config.LINE_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

instance.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.LINE_CHANNEL_ACCESS_TOKEN}`;
  return c;
});

const reply = ({
  replyToken,
  messages,
}) => instance.post('/v2/bot/message/reply', {
  replyToken,
  messages,
});

const fetchProfile = ({
  userId,
}) => instance.get(`/v2/bot/profile/${userId}`);

export {
  reply,
  fetchProfile,
};
