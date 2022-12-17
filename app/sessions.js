import Session from './models/session.js';

const sessions = new Map();

/**
 * @param {string} userId
 * @returns {Session}
 */
const getSession = (userId) => sessions.get(userId) || new Session();

/**
 * @param {string} userId
 * @param {Session} session
 */
const setSession = (userId, session) => {
  sessions.set(userId, session);
};

/**
 * @param {string} userId
 */
const removeSession = (userId) => {
  sessions.delete(userId);
};

const printSessions = () => {
  console.info(Array.from(sessions).map(([id, session]) => `=== ${id.slice(0, 6)} ===\n\n${session.toString()}`).join('\n'));
};

export {
  getSession,
  setSession,
  removeSession,
  printSessions,
};

export default sessions;
