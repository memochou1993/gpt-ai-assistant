import {
  EVENT_TYPE_MESSAGE, EVENT_TYPE_POSTBACK, MESSAGE_TYPE_TEXT, SOURCE_TYPE_USER,
} from '../services/line.js';

export const TIMEOUT = 9 * 1000;

export const USER_ID = '000000';

const createPostbackEvents = (actions) => actions.map((action) => ({
  replyToken: '',
  type: EVENT_TYPE_POSTBACK,
  source: { type: SOURCE_TYPE_USER, userId: USER_ID },
  postback: { data: JSON.stringify({ action }) },
}));

const createMessageEvents = (messages) => messages.map((text) => ({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: { type: SOURCE_TYPE_USER, userId: USER_ID },
  message: { type: MESSAGE_TYPE_TEXT, text },
}));

export {
  createPostbackEvents,
  createMessageEvents,
};
