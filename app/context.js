import { AxiosError } from 'axios';
import config from '../config/index.js';
import { t } from '../locales/index.js';
import {
  MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_GROUP, SOURCE_TYPE_USER,
} from '../services/line.js';
import { fetchUser } from '../utils/index.js';
import { Command, COMMAND_BOT_RETRY } from './commands/index.js';
import Event from './models/event.js';
import { updateHistory } from './history/index.js';
import {
  ImageMessage, Message, TemplateMessage, TextMessage,
} from './messages/index.js';
import { Source } from './models/index.js';
import { getSources, setSources } from './repository/index.js';

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
    const text = this.event.text.replaceAll('　', ' ').trim();
    if (text.startsWith(config.BOT_NAME)) return text.replace(config.BOT_NAME, '').trim();
    return text;
  }

  get hasBotName() {
    const content = this.event.text.replaceAll('　', ' ').trim().toLowerCase();
    return content.startsWith(config.BOT_NAME.toLowerCase());
  }

  /**
   * @throws {Error}
   */
  validate() {
    const sources = getSources();
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
    const sources = getSources();
    const newSources = {};
    if (this.event.isGroup && !sources[this.groupId]) {
      newSources[this.groupId] = new Source({ type: SOURCE_TYPE_GROUP, isActivated: !config.BOT_DEACTIVATED });
    }
    if (!sources[this.userId]) {
      newSources[this.userId] = new Source({ type: SOURCE_TYPE_USER, isActivated: !config.BOT_DEACTIVATED });
    }
    Object.assign(sources, newSources);
    if (Object.keys(newSources).length > 0) await setSources(sources);
    this.source = sources[this.id];
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
    const content = this.trimmedText.toLowerCase();
    if (aliases.some((alias) => content.startsWith(alias.toLowerCase()))) return true;
    if (aliases.some((alias) => content.endsWith(alias.toLowerCase()))) return true;
    if (content.startsWith(text.toLowerCase())) return true;
    if (content.endsWith(text.toLowerCase())) return true;
    return false;
  }

  /**
   * @param {string} text
   * @param {Array<Command>} actions
   * @returns {Context}
   */
  pushText(text, actions = []) {
    if (!text) return this;
    const message = new TextMessage({
      type: MESSAGE_TYPE_TEXT,
      text,
    });
    message.setQuickReply(actions);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {string} url
   * @param {Array<Command>} actions
   * @returns {Context}
   */
  pushImage(url, actions = []) {
    if (!url) return this;
    const message = new ImageMessage({
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
   * @param {Array<Command>} buttons
   * @param {Array<Command>} actions
   * @returns {Context}
   */
  pushTemplate(text, buttons = [], actions = []) {
    if (!text) return this;
    const message = new TemplateMessage({
      text,
      actions: buttons,
    });
    message.setQuickReply(actions);
    this.messages.push(message);
    return this;
  }

  /**
   * @param {AxiosError} err
   * @returns {Context}
   */
  pushError(err) {
    this.error = err;
    if (err.code === 'ECONNABORTED') {
      if (config.ERROR_TIMEOUT_DISABLED) return this;
      return this.pushText(t('__ERROR_ECONNABORTED'), [COMMAND_BOT_RETRY]);
    }
    this.pushText(err.message);
    if (err.config?.baseURL) this.pushText(`${err.config.method.toUpperCase()} ${err.config.baseURL}${err.config.url}`);
    if (err.response?.data?.error?.message) this.pushText(err.response.data.error.message);
    return this;
  }
}

export default Context;
