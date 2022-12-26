import config from '../config/index.js';
import { EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT } from '../services/line.js';

class Event {
  type;

  replyToken;

  source;

  message;

  constructor({
    type,
    replyToken,
    source,
    message,
  }) {
    this.type = type;
    this.replyToken = replyToken;
    this.source = source;
    this.message = message;
  }

  /**
   * @returns {boolean}
   */
  get isMessage() {
    return this.type === EVENT_TYPE_MESSAGE;
  }

  /**
   * @returns {boolean}
   */
  get isText() {
    return this.message.type === MESSAGE_TYPE_TEXT;
  }

  /**
   * @returns {string}
   */
  get userId() {
    return this.source.userId;
  }

  /**
   * @returns {string}
   */
  get text() {
    return this.message.text;
  }

  /**
   * @returns {string}
   */
  get trimmedText() {
    return this.text.replace(config.SETTING_AI_NAME, ' ').replaceAll('　', ' ').trim();
  }
}

export default Event;
