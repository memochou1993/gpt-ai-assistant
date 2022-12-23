import { t } from '../languages/index.js';
import { PARTICIPANT_AI } from '../services/openai.js';

const MAX_LINE_COUNT = 16;

class Session {
  lines = [];

  constructor() {
    this
      .write(`${PARTICIPANT_AI}: `)
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
  console.info(Array.from(sessions).map(([id, session]) => `=== ${id.slice(0, 6)} ===\n\n${session.toString()}\n`).join('\n'));
};

export {
  getSession,
  setSession,
  removeSession,
  printSessions,
};
