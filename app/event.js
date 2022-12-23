import {
  EVENT_TYPE_MESSAGE, EVENT_TYPE_POSTBACK, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT,
} from '../services/line.js';
import { Image, Template, Text } from './messages/index.js';
import { MessageAction } from './actions/index.js';

// FIXME: rename to Context
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
   * @param {Object} param
   * @param {string} param.text
   * @param {Array<string>} param.aliases
   * @returns {boolean}
   */
  isCommand({
    text,
    aliases,
  }) {
    if (!this.isMessage || !this.isText) return false;
    const input = this.message.text.trim().toLowerCase().replaceAll('　', ' ');
    if (input === text.toLowerCase()) return true;
    if (aliases.some((alias) => input === alias.toLowerCase())) return true;
    return false;
  }

  /**
   * @param {Object} param
   * @param {string} param.text
   * @param {Array<string>} param.aliases
   * @returns {boolean}
   */
  hasCommand({
    text,
    aliases,
  }) {
    if (!this.isMessage || !this.isText) return false;
    const input = this.message.text.trim().toLowerCase().replaceAll('　', ' ');
    if (input === text.toLowerCase()) return false;
    if (aliases.some((alias) => input.startsWith(alias.toLowerCase()))) return true;
    if (aliases.some((alias) => input.endsWith(alias.toLowerCase()))) return true;
    if (input.startsWith(text.toLowerCase())) return true;
    if (input.endsWith(text.toLowerCase())) return true;
    return false;
  }

  /**
   * @param {string} text
   * @param {Array<MessageAction>} actions
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
   * @param {Array<MessageAction>} actions
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
   * @param {Array<MessageAction>} buttons
   * @param {Array<MessageAction>} actions
   * @returns {Event}
   */
  sendTemplate(text, buttons = [], actions = []) {
    const message = new Template({
      text,
      buttons,
    });
    message.setQuickReply(actions);
    this.messages.push(message);
    return this;
  }
}

export default Event;
