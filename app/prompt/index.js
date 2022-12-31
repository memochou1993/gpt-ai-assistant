import Prompt from './prompt.js';
import { SENTENCE_ENQUIRING } from './sentence.js';

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
  SENTENCE_ENQUIRING,
  getPrompt,
  setPrompt,
  removePrompt,
  printPrompts,
};

export default prompts;