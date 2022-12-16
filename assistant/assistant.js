import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
} from '../services/line/index.js';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
} from '../services/openai/index.js';
import {
  deploy,
} from '../services/vercel/index.js';
import storage from '../storage/index.js';
import {
  completePrompt,
  getVersion,
  replyMessage,
} from '../utils/index.js';
import Event from './event.js';
import Prompt from './prompt.js';
import settings, {
  SETTING_AI_AUTO_REPLY,
} from './settings.js';

class Assistant {
  prompts = new Map();

  constructor() {
    storage.init(settings);
  }

  async handleEvents(events = []) {
    return Promise.all(
      (await Promise.all(
        events
          .filter(({ type }) => type === EVENT_TYPE_MESSAGE)
          .filter(({ message }) => message.type === MESSAGE_TYPE_TEXT)
          .map((event) => this.handleEvent(new Event(event))),
      ))
        .map((event) => replyMessage(event)),
    );
  }

  /**
   * @param {Event} event
   * @returns {Object}
   */
  async handleEvent(event) {
    if (event.isCommandVersion) {
      event.pushReply(getVersion());
      return event;
    }
    if (event.isCommandDeploy) {
      await deploy();
      event.pushReply('deploying');
      return event;
    }
    if (event.isCommandAIAutoReplyOff) {
      await storage.setItem(SETTING_AI_AUTO_REPLY, false);
      event.pushReply('off');
      return event;
    }
    if (event.isCommandAIAutoReplyOn) {
      await storage.setItem(SETTING_AI_AUTO_REPLY, true);
      event.pushReply('on');
      return event;
    }
    if (event.isCommandAI || await storage.getItem(SETTING_AI_AUTO_REPLY)) {
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
    return event;
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
