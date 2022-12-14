import fs from 'fs';
import config from '../config/index.js';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
} from '../services/openai/index.js';
import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
} from '../services/line/index.js';
import {
  completePrompt,
  fetchVersion,
  replyMessage,
} from '../utils/index.js';
import Event from './event.js';
import Prompt from './prompt.js';

class Assistant {
  version;

  owner;

  prompts = new Map();

  constructor() {
    const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    this.version = version;
  }

  async handleEvents(events = []) {
    return Promise.all(
      (await Promise.all(
        events
          .filter(({ type }) => type === EVENT_TYPE_MESSAGE)
          .filter(({ message }) => message.type === MESSAGE_TYPE_TEXT)
          .map((event) => this.handleEvent(new Event(event))),
      ))
        .map((event) => (config.APP_ENV === 'local' ? event : replyMessage(event))),
    );
  }

  /**
   * @param {Event} event
   * @returns {Object}
   */
  async handleEvent(event) {
    if (!this.owner) this.setOwner(event.userId);
    if (event.isCommandGetVersion) {
      event.pushReply(this.version);
      if (this.version !== (await fetchVersion())) {
        event.pushReply('A new version of GPT AI Assistant is available. Please update source code.');
      }
      return event;
    }
    if (event.userId === this.owner) {
      if (event.isCommandGetEnv) {
        event.handleCommandGetEnv(config);
        return event;
      }
      if (event.isCommandSetEnv) {
        event.handleCommandSetEnv(config);
        return event;
      }
    }
    try {
      const prompt = this.getPrompt(event.userId);
      prompt.write(`${PARTICIPANT_HUMAN}: ${event.text}？`);
      const { text } = await completePrompt({ prompt: prompt.toString() });
      prompt.write(`${PARTICIPANT_AI}: ${text}`);
      this.setPrompt(event.userId, prompt);
      event.pushReply(text);
      return event;
    } catch (err) {
      event.pushReply(err.message);
      return event;
    }
  }

  setOwner(userId) {
    this.owner = userId;
  }

  /**
   * @param {string} userId
   * @returns {Prompt}
   */
  getPrompt(userId) {
    return this.prompts.get(userId) || new Prompt();
  }

  /**
   * @param {string} userId
   * @param {Prompt} prompt
   */
  setPrompt(userId, prompt) {
    this.prompts.set(userId, prompt);
  }

  printPrompts() {
    const prompts = Array.from(this.prompts)
      .map(([id, prompt]) => `=== ${id.slice(0, 6)} ===\n\n${prompt.toString()}`)
      .join('\n');
    console.info(prompts);
  }
}

export default Assistant;
