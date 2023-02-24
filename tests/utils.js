import Event from '../app/models/event.js';
import { MOCK_TEXT_OK, MOCK_USER_01, MOCK_USER_02 } from '../constants/mock.js';
import {
  EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_GROUP, SOURCE_TYPE_USER,
} from '../services/line.js';

export const TIMEOUT = 9 * 1000;

const createEvents = (
  messages,
  groupId,
  userId = MOCK_USER_01,
) => messages.map((text) => new Event({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: { type: groupId ? SOURCE_TYPE_GROUP : SOURCE_TYPE_USER, userId, groupId },
  message: { type: MESSAGE_TYPE_TEXT, text },
}));

export {
  MOCK_TEXT_OK,
  MOCK_USER_01,
  MOCK_USER_02,
  createEvents,
};
