import {
  EVENT_TYPE_MESSAGE, EVENT_TYPE_POSTBACK, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT,
} from '../services/line.js';
import { Image, Template, Text } from './messages/index.js';
import { Action } from './actions/index.js';

class Event {
  messages = [];

  replyToken;

  type;

  source;

  message;

  postback;

  constructor({
    replyToken,
    type,
    source,
    message,
    postback,
  }) {
    this.replyToken = replyToken;
    this.type = type;
    this.source = source;
    this.message = message;
    this.postback = postback;
  }

  /**
   * @returns {boolean}
   */
  get isPostback() {
    return this.type === EVENT_TYPE_POSTBACK;
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
    if (!this.isMessage) return '';
    if (!this.isText) return this.message.type;
    return this.message.text.substring(this.message.text.indexOf(' ') + 1);
  }

  /**
   * @param {Command} param
   * @returns {boolean}
   */
  isCommand({
    text,
  }) {
    if (this.isPostback) {
      const { action } = JSON.parse(this.postback.data);
      return action === text;
    }
    if (this.isMessage && this.isText) {
      return this.message.text.toLowerCase().split(' ').shift() === text;
    }
    return false;
  }

  /**
   * @param {string} text
   * @param {Array<Action>} actions
   * @returns {Event}
   */
  sendText(text, actions = []) {
    const message = new Text({
      type: MESSAGE_TYPE_TEXT,
      text,
    });
    message.setQuickReply(actions);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {string} url
   * @param {Array<Action>} actions
   * @returns {Event}
   */
  sendImage(url, actions = []) {
    const message = new Image({
      type: MESSAGE_TYPE_IMAGE,
      originalContentUrl: url,
      previewImageUrl: url,
    });
    message.setQuickReply(actions);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {string} url
   * @param {Array<Action>} buttons
   * @returns {Event}
   */
  sendTemplate(text, buttons = []) {
    const message = new Template({
      text,
      buttons,
    });
    this.messages.push(message);
    return this;
  }
}

export default Event;
