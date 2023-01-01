import { AxiosError } from 'axios';
import config from '../config/index.js';
import { SETTING_GROUPS, SETTING_USERS } from '../constants/setting.js';
import { t } from '../locales/index.js';
import { MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT } from '../services/line.js';
import storage from '../storage/index.js';
import fetchUser from '../utils/fetch-user.js';
import { MessageAction } from './actions/index.js';
import Event from './event.js';
import { updateHistory } from './history/index.js';
import { ImageMessage, TemplateMessage, TextMessage } from './messages/index.js';

class Context {
  event;

  user;

  messages = [];

  /**
   * @param {Event} event
   */
  constructor(event) {
    this.event = event;
  }

  async initialize() {
    try {
      await this.registerGroup();
      await this.registerUser();
    } catch (err) {
      this.pushError(err);
      return this;
    }
    this.user = await fetchUser(this.userId);
    updateHistory(this.contextId, (history) => history.write(this.user.displayName, this.trimmedText));
    return this;
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
  get groupId() {
    return this.event.groupId;
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
  get trimmedText() {
    if (!this.event.isText) return this.event.message.type;
    const text = this.event.text.replaceAll('　', ' ').trim();
    if (text.startsWith(config.BOT_NAME)) return text.replace(config.BOT_NAME, '');
    return text;
  }

  async registerGroup() {
    if (!this.event.isGroup) return;
    const groups = JSON.parse(storage.getItem(SETTING_GROUPS) || '{}');
    if (groups[this.groupId]) return;
    if (Object.keys(groups).length < config.APP_MAX_GROUPS) {
      groups[this.groupId] = true;
      await storage.setItem(SETTING_GROUPS, JSON.stringify(groups));
      return;
    }
    throw new Error(t('__ERROR_MAX_GROUPS_REACHED'));
  }

  async registerUser() {
    const users = JSON.parse(storage.getItem(SETTING_USERS) || '{}');
    if (users[this.userId]) return;
    if (Object.keys(users).length < config.APP_MAX_USERS) {
      users[this.userId] = true;
      await storage.setItem(SETTING_USERS, JSON.stringify(users));
      return;
    }
    throw new Error(t('__ERROR_MAX_USERS_REACHED'));
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
    const content = this.trimmedText.toLowerCase();
    if (content === text.toLowerCase()) return true;
    if (aliases.some((alias) => content === alias.toLowerCase())) return true;
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
    const content = this.trimmedText.toLowerCase();
    if (aliases.some((alias) => content.startsWith(alias.toLowerCase()))) return true;
    if (aliases.some((alias) => content.endsWith(alias.toLowerCase()))) return true;
    if (content.startsWith(text.toLowerCase())) return true;
    if (content.endsWith(text.toLowerCase())) return true;
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
    this.error = err;
    this.pushText(`${err.message}`);
    if (err.config?.baseURL) this.pushText(`${err.config.method.toUpperCase()} ${err.config.baseURL}/${err.config.url}`);
    if (err.response?.data?.error?.message) this.pushText(err.response.data.error.message);
    return this;
  }
}

export default Context;
