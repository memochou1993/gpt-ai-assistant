import Event from '../app/event.js';
import {
  EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_USER,
} from '../services/line.js';

export const TIMEOUT = 9 * 1000;

export const USER_ID = '000000';

const createEvents = (messages) => messages.map((text) => new Event({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: { type: SOURCE_TYPE_USER, userId: USER_ID },
  message: { type: MESSAGE_TYPE_TEXT, text },
}));

export {
  createEvents,
};
