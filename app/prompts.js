import config from '../config/index.js';
import { t } from '../languages/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../services/openai.js';

const MAX_LINE_COUNT = 16;

class Prompt {
  displayName;

  lines = [];

  constructor() {
    this
      .write(`\n${PARTICIPANT_AI}: `)
      .write(t('__COMPLETION_INIT_MESSAGE'));
  }

  setDisplayName(displayName) {
    this.displayName = displayName;
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

const getFormattedPrompts = () => (
  Array.from(prompts).map(
    ([id, prompt]) => prompt.lines.map(
      (line) => {
        if (line === `\n${PARTICIPANT_AI}: `) return `\n${config.SETTING_AI_NAME}: `;
        if (line === `\n${PARTICIPANT_HUMAN}: `) return `\n${prompt.displayName}: `;
        return line;
      },
    ).join(''),
  ).join('\n')
);

const printFormattedPrompts = () => {
  if (Array.from(prompts).length < 1) return;
  console.info(getFormattedPrompts());
};

export {
  getPrompt,
  setPrompt,
  removePrompt,
  getFormattedPrompts,
  printFormattedPrompts,
};

export default prompts;
