import { t } from '../languages/index.js';
import { PARTICIPANT_AI } from '../services/openai.js';

const MAX_LINE_COUNT = 16;

class Prompt {
  lines = [];

  constructor() {
    this
      .write(`\n${PARTICIPANT_AI}: `)
      .write(t('__COMPLETION_INIT_MESSAGE'));
  }

  write(text) {
    if (this.lines.length >= MAX_LINE_COUNT) {
      this.lines.shift();
    }
    this.lines.push(text);
    return this;
  }

  toString() {
    return this.lines.join('');
  }
}

const prompts = new Map();

/**
 * @param {string} userId
 * @returns {Prompt}
 */
const getPrompt = (userId) => prompts.get(userId) || new Prompt();

/**
 * @param {string} userId
 * @param {Prompt} prompt
 */
const setPrompt = (userId, prompt) => {
  prompts.set(userId, prompt);
};

/**
 * @param {string} userId
 */
const removePrompt = (userId) => {
  prompts.delete(userId);
};

export {
  getPrompt,
  setPrompt,
  removePrompt,
};

export default prompts;
