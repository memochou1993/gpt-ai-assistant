// eslint-disable-next-line max-classes-per-file
import { t } from '../languages/index.js';
import { PARTICIPANT_AI } from '../services/openai.js';

export const SENTENCE_PROMPTING = 'prompting';
export const SENTENCE_ENQUIRING = 'enquiring';

// FIXME
class Sentence {
  type;

  title;

  text;

  constructor({
    type,
    title,
    text,
  }) {
    this.type = type;
    this.title = title;
    this.text = text;
  }

  get isEnquiring() {
    return this.text === SENTENCE_ENQUIRING;
  }

  toString() {
    return this.title ? `\n${this.title}: ${this.text}` : this.text;
  }
}

const MAX_LINE_COUNT = 16;

class Prompt {
  sentences = [];

  constructor() {
    this.write(PARTICIPANT_AI, t('__COMPLETION_INIT_MESSAGE'));
  }

  /**
   * @returns {Sentence}
   */
  get lastSentence() {
    return this.sentences.length > 0 ? this.sentences[this.sentences.length - 1] : null;
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  write(title, text = '') {
    if (this.sentences.length >= MAX_LINE_COUNT) {
      this.sentences.shift();
    }
    this.sentences.push(new Sentence({ type: SENTENCE_PROMPTING, title, text }));
    return this;
  }

  /**
   * @param {string} text
   */
  patch(text) {
    this.sentences[this.sentences.length - 1].text += text;
  }

  toString() {
    return this.sentences.map((sentence) => sentence.toString()).join('');
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

const printPrompts = () => {
  if (Array.from(prompts.keys()).length < 1) return;
  const content = Array.from(prompts.keys()).map((userId) => `\n=== ${userId.slice(6)} ===\n${getPrompt(userId)}`).join('\n');
  console.info(content);
};

export {
  getPrompt,
  setPrompt,
  removePrompt,
  printPrompts,
};

export default prompts;
