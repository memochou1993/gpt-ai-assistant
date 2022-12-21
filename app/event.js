import { EVENT_TYPE_MESSAGE, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT } from '../services/line.js';
import { Image, Text } from './messages/index.js';

class Event {
  messages = [];

  replyToken;

  type;

  source;

  message;

  constructor({
    replyToken,
    type,
    source,
    message,
  }) {
    this.replyToken = replyToken;
    this.type = type;
    this.source = source;
    this.message = message;
  }

  /**
   * @returns {boolean}
   */
  get isEventTypeMessage() {
    return this.type === EVENT_TYPE_MESSAGE;
  }

  /**
   * @returns {boolean}
   */
  get isMessageTypeText() {
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
    return this.message.text.substring(this.message.text.indexOf(' ') + 1);
  }

  /**
   * @returns {string}
   */
  isCommand(command) {
    return this.message.text.toLowerCase().split(' ').shift() === command;
  }

  /**
   * @returns {Array}
   */
  hasArgument(argument) {
    return this.text
      .toLowerCase()
      .split('--')
      .filter(Boolean)
      .map((v) => v.trim())
      .includes(argument);
  }

  /**
   * @param {string} text
   * @param {Array} replyActions
   * @returns {Event}
   */
  sendText(text, replyActions = []) {
    this.messages.push(new Text({
      type: MESSAGE_TYPE_TEXT,
      text,
      replyActions,
    }));
    return this;
  }

  /**
   * @param {string} url
   * @returns {Event}
   */
  sendImage(url) {
    this.messages.push(new Image({
      type: MESSAGE_TYPE_IMAGE,
      originalContentUrl: url,
      previewImageUrl: url,
    }));
    return this;
  }
}

export default Event;
