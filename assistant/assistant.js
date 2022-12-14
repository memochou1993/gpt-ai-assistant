import fs from 'fs';
import {
  APP_ENV,
} from '../config/index.js';
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
  replyMessage,
  fetchVersion,
} from '../utils/index.js';
import Prompt from './prompt.js';

const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));

class Assistant {
  initialized = false;

  version;

  prompts = new Map();

  constructor() {
    this.fetchVersion();
  }

  async fetchVersion() {
    const { data } = await fetchVersion;
    this.version = data.version;
  }

  async handleEvents(events = []) {
    return Promise.all(
      (await Promise.all(
        events
          .filter(({ type }) => type === EVENT_TYPE_MESSAGE)
          .filter(({ message }) => message.type === MESSAGE_TYPE_TEXT)
          .map((event) => this.handleEvent(event)),
      ))
        .map((message) => (APP_ENV === 'local' ? message : replyMessage(message))),
    );
  }

  get isInitialized() {
    return this.initialized || this.version === version || APP_ENV === 'local';
  }

  async handleEvent({
    replyToken,
    source,
    message,
  }) {
    if (!this.isInitialized) {
      this.initialized = true;
      return { replyToken, text: 'A new version of GPT AI Assistant is available. Please update source code.' };
    }
    try {
      const prompt = this.getPrompt(source.userId);
      prompt.write(`${PARTICIPANT_HUMAN}: ${message.text}？`);
      const { text } = await completePrompt({ prompt: prompt.toString() });
      prompt.write(`${PARTICIPANT_AI}: ${text}`);
      this.setPrompt(source.userId, prompt);
      return { replyToken, text };
    } catch (err) {
      return { replyToken, text: err.message };
    }
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
