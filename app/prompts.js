import { t } from '../languages/index.js';
import { PARTICIPANT_AI } from '../services/openai.js';

export const STOP_TYPE_ENQUIRING = 'enquiring';

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

const printFormattedPrompts = () => {
  if (Array.from(prompts.keys()).length < 1) return;
  const content = Array.from(prompts.keys()).map((userId) => `\n=== ${userId.slice(6)} ===\n${getPrompt(userId)}`).join('\n');
  console.info(content);
};

export {
  getPrompt,
  setPrompt,
  removePrompt,
  printFormattedPrompts,
};

export default prompts;
