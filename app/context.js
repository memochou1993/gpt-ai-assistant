import { AxiosError } from 'axios';
import fs from 'fs';
import config from '../config/index.js';
import { t } from '../locales/index.js';
import {
  MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT, SOURCE_TYPE_GROUP, SOURCE_TYPE_USER,
} from '../services/line.js';
import {
  addMark,
  convertText,
  fetchAudio,
  fetchGroup,
  fetchUser,
  generateTranscription,
} from '../utils/index.js';
import { Command, COMMAND_BOT_RETRY } from './commands/index.js';
import { updateHistory } from './history/index.js';
import {
  ImageMessage, Message, TemplateMessage, TextMessage,
} from './messages/index.js';
import { Bot, Event, Source } from './models/index.js';
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
   * @type {string}
   */
  transcription;

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
    if (this.event.isText) {
      const text = this.event.text.replaceAll('　', ' ').replace(config.BOT_NAME, '').trim();
      return addMark(text);
    }
    if (this.event.isAudio) {
      const text = this.transcription.replace(config.BOT_NAME, '').trim();
      return addMark(text);
    }
    return '?';
  }

  get hasBotName() {
    if (this.event.isText) {
      const text = this.event.text.replaceAll('　', ' ').trim().toLowerCase();
      return text.startsWith(config.BOT_NAME.toLowerCase());
    }
    if (this.event.isAudio) {
      const text = this.transcription.toLowerCase();
      return text.startsWith(config.BOT_NAME.toLowerCase());
    }
    return false;
  }

  async initialize() {
    try {
      this.validate();
      await this.register();
    } catch (err) {
      return this.pushError(err);
    }
    if (this.event.isAudio) {
      try {
        await this.transcribe();
      } catch (err) {
        return this.pushError(err);
      }
    }
    updateHistory(this.id, (history) => history.write(this.source.name, this.trimmedText));
    return this;
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
      const { groupName } = await fetchGroup(this.groupId);
      newSources[this.groupId] = new Source({
        type: SOURCE_TYPE_GROUP,
        name: groupName,
        bot: new Bot({
          isActivated: !config.BOT_DEACTIVATED,
        }),
      });
    }
    if (!sources[this.userId]) {
      const { displayName } = await fetchUser(this.userId);
      newSources[this.userId] = new Source({
        type: SOURCE_TYPE_USER,
        name: displayName,
        bot: new Bot({
          isActivated: !config.BOT_DEACTIVATED,
        }),
      });
    }
    Object.assign(sources, newSources);
    if (Object.keys(newSources).length > 0) await setSources(sources);
    this.source = new Source(sources[this.id]);
  }

  async transcribe() {
    const buffer = await fetchAudio(this.event.messageId);
    const file = `/tmp/${this.event.messageId}.m4a`;
    fs.writeFileSync(file, buffer);
    const { text } = await generateTranscription({ file, buffer });
    this.transcription = convertText(text);
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
    if (content.startsWith(text.toLowerCase())) return true;
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
      text: convertText(text),
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
    console.log(this.error.message);
    if (err.code === 'ECONNABORTED') {
      if (config.ERROR_TIMEOUT_DISABLED) return this;
      return this.pushText(t('__ERROR_ECONNABORTED'), [COMMAND_BOT_RETRY]);
    }
    if (err.config?.baseURL) this.pushText(`${err.config.method.toUpperCase()} ${err.config.baseURL}${err.config.url}`);
    if (err.response) this.pushText(`Request failed with status code ${err.response.status}`);
    this.pushText(err.message);
    return this;
  }
}

export default Context;
