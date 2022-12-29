import Event from '../app/event.js';
import { USER_ID_01, USER_ID_02 } from '../constants/mock.js';
import {
  EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_USER,
} from '../services/line.js';

export const TIMEOUT = 9 * 1000;

const createEvents = (messages, userId = USER_ID_01) => messages.map((text) => new Event({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: { type: SOURCE_TYPE_USER, userId },
  message: { type: MESSAGE_TYPE_TEXT, text },
}));

export {
  USER_ID_01,
  USER_ID_02,
  createEvents,
};
