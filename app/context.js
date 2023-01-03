import { AxiosError } from 'axios';
import config from '../config/index.js';
import { t } from '../locales/index.js';
import {
  MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_GROUP, SOURCE_TYPE_USER,
} from '../services/line.js';
import storage from '../storage/index.js';
import fetchUser from '../utils/fetch-user.js';
import { MessageAction } from './actions/index.js';
import Event from './event.js';
import { updateHistory } from './history/index.js';
import {
  ImageMessage, Message, TemplateMessage, TextMessage,
} from './messages/index.js';
import { Source } from './models/index.js';
import { FIELD_SOURCES } from './repository/index.js';

class Context {
  /**
   * @type {Event}
   */
  event;

  /**
   * @type {Source}
   */
  source;

  /**
   * @type {Array<Message>}
   */
  messages = [];

  /**
   * @param {Event} event
   */
  constructor(event) {
    this.event = event;
  }

  async initialize() {
    try {
      this.validate();
      await this.register();
    } catch (err) {
      this.pushError(err);
      return this;
    }
    const { displayName } = await fetchUser(this.userId);
    updateHistory(this.id, (history) => history.write(displayName, this.trimmedText));
    return this;
  }

  get id() {
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
    if (text.startsWith(config.BOT_NAME)) return text.replace(config.BOT_NAME, '').trim();
    return text;
  }

  /**
   * @throws {Error}
   */
  validate() {
    // TODO: use repository
    /** @type {Array<Source>} sources */
    const sources = storage.getItem(FIELD_SOURCES) || {};
    const groups = Object.values(sources).filter(({ type }) => type === SOURCE_TYPE_GROUP);
    const users = Object.values(sources).filter(({ type }) => type === SOURCE_TYPE_USER);
    if (this.event.isGroup && !sources[this.groupId] && groups.length >= config.APP_MAX_GROUPS) {
      throw new Error(t('__ERROR_MAX_GROUPS_REACHED'));
    }
    if (!sources[this.userId] && users.length >= config.APP_MAX_USERS) {
      throw new Error(t('__ERROR_MAX_USERS_REACHED'));
    }
  }

  async register() {
    // TODO: use repository
    /** @type {Array<Source>} sources */
    const sources = storage.getItem(FIELD_SOURCES) || {};
    if (this.event.isGroup && !sources[this.groupId]) {
      sources[this.groupId] = new Source({ type: SOURCE_TYPE_GROUP });
      console.log('register group');
    }
    if (!sources[this.userId]) {
      sources[this.userId] = new Source({ type: SOURCE_TYPE_USER });
      console.log('register user');
    }
    this.source = sources[this.id];
    await storage.setItem(FIELD_SOURCES, sources);
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
    this.pushText(err.message);
    if (err.config?.baseURL) this.pushText(`${err.config.method.toUpperCase()} ${err.config.baseURL}/${err.config.url}`);
    if (err.response?.data?.error?.message) this.pushText(err.response.data.error.message);
    return this;
  }
}

export default Context;
