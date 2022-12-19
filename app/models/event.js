import { EVENT_TYPE_MESSAGE, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT } from '../../services/line.js';

class Event {
  messages = [];

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
  get input() {
    return this.message.text;
  }

  /**
   * @returns {string}
   */
  get text() {
    return this.input.substring(this.input.indexOf(' ') + 1);
  }

  /**
   * @returns {string}
   */
  isCommand(command) {
    return this.input.toLowerCase().split(' ').shift() === command;
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
   * @returns {Event}
   */
  sendText(text) {
    this.messages.push({
      type: MESSAGE_TYPE_TEXT,
      text,
    });
    return this;
  }

  /**
   * @param {string} url
   * @returns {Event}
   */
  sendImage(url) {
    this.messages.push({
      type: MESSAGE_TYPE_IMAGE,
      originalContentUrl: url,
      previewImageUrl: url,
    });
    return this;
  }
}

export default Event;
