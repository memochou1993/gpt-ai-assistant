import Prompt from './models/prompt.js';

const sessions = new Map();

/**
 * @param {string} userId
 * @returns {Prompt}
 */
const getSession = (userId) => sessions.get(userId) || new Prompt();

/**
 * @param {string} userId
 * @param {Prompt} prompt
 */
const setSession = (userId, prompt) => {
  sessions.set(userId, prompt);
};

/**
 * @param {string} userId
 */
const removeSession = (userId) => {
  sessions.delete(userId);
};

const printSessions = () => {
  const prompts = Array.from(sessions)
    .map(([id, prompt]) => `=== ${id.slice(0, 6)} ===\n\n${prompt.toString()}`)
    .join('\n');
  console.info(prompts);
};

export {
  getSession,
  setSession,
  removeSession,
  printSessions,
};

export default sessions;
