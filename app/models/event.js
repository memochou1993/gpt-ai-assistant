import { EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_GROUP } from '../../services/line.js';

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
  get isGroup() {
    return this.source.type === SOURCE_TYPE_GROUP;
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
  get groupId() {
    return this.source.groupId;
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
}

export default Event;
