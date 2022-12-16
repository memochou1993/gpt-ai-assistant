import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
} from '../services/line/index.js';

const createEvents = (messages) => messages.map((message) => ({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: { type: 'user', userId: '000000' },
  message: { type: MESSAGE_TYPE_TEXT, text: message },
}));

export {
  createEvents,
};

export default null;
