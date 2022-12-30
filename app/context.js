import { AxiosError } from 'axios';
import { writeHistory } from './histories.js';
import { MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT } from '../services/line.js';
import { MessageAction } from './actions/index.js';
import Event from './event.js';
import { ImageMessage, TemplateMessage, TextMessage } from './messages/index.js';
import fetchUser from '../utils/fetch-user.js';

class Context {
  event;

  messages = [];

  /**
   * @param {Event} event
   */
  constructor(event) {
    this.event = event;
    this.writeHistory();
  }

  get contextId() {
    if (this.event.isGroup) return this.event.source.groupId;
    return this.event.source.userId;
  }

  /**
   * @returns {string}
   */
  get replyToken() {
    return this.event.replyToken;
  }

  /**
   * @returns {string}
   */
  get userId() {
    return this.event.userId;
  }

  /**
   * @returns {string}
   */
  get argument() {
    if (!this.event.isText) return this.event.message.type;
    return this.event.text.substring(this.event.text.indexOf(' ') + 1);
  }

  async writeHistory() {
    const { displayName } = await fetchUser(this.userId);
    writeHistory(this.contextId, displayName, this.event.trimmedText);
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
    if (!this.event.isText) return false;
    const input = this.event.trimmedText.toLowerCase();
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
    if (!this.event.isText) return false;
    const input = this.event.trimmedText.toLowerCase();
    if (input === text.toLowerCase()) return false;
    if (aliases.some((alias) => input.startsWith(alias.toLowerCase()))) return true;
    if (aliases.some((alias) => input.endsWith(alias.toLowerCase()))) return true;
    if (input.startsWith(text.toLowerCase())) return true;
    if (input.endsWith(text.toLowerCase())) return true;
    return false;
  }

  /**
   * @param {string} text
   * @param {Array<MessageAction>} replies
   * @returns {Context}
   */
  pushText(text, replies = []) {
    const message = new TextMessage({
      type: MESSAGE_TYPE_TEXT,
      text,
    });
    message.setQuickReply(replies);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {string} url
   * @param {Array<MessageAction>} replies
   * @returns {Context}
   */
  pushImage(url, replies = []) {
    const message = new ImageMessage({
      type: MESSAGE_TYPE_IMAGE,
      originalContentUrl: url,
      previewImageUrl: url,
    });
    message.setQuickReply(replies);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {string} url
   * @param {Array<MessageAction>} buttons
   * @param {Array<MessageAction>} replies
   * @returns {Context}
   */
  pushTemplate(text, buttons = [], replies = []) {
    const message = new TemplateMessage({
      text,
      actions: buttons,
    });
    message.setQuickReply(replies);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {AxiosError} err
   * @returns {Context}
   */
  pushError(err) {
    this.pushText(err.message);
    const details = [];
    details.push(`Method: ${err?.request?.method || null}`);
    details.push(`Host: ${err?.request?.host || null}`);
    details.push(`Path: ${err?.request?.path || null}`);
    details.push(`Code: ${err?.response?.data?.error?.code || null}`);
    details.push(`Message: ${err?.response?.data?.error?.message || null}`);
    this.pushText(details.join('\n'));
    return this;
  }
}

export default Context;
