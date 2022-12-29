import prompts from '../app/prompts.js';
import { fetchUser } from '../utils/index.js';

class Record {
  userId;

  displayName;

  text;

  constructor({
    userId,
    displayName,
    text,
  }) {
    this.userId = userId;
    this.displayName = displayName;
    this.text = text;
  }

  setDisplayName(displayName) {
    this.displayName = displayName;
  }

  toString() {
    return `${this.displayName || this.userId}: ${this.text}`;
  }
}

const history = [];

/**
 * @param {string} userId
 * @param {string} text
 */
const writeHistory = (userId, text) => {
  history.push(new Record({ userId, text }));
};

/**
 * @param {Object} param
 * @param {boolean} param.showDisplayName
 * @returns {Promise<string>}
 */
const getFormattedHistory = async ({ showDisplayName = false } = {}) => {
  let profiles = [];
  if (showDisplayName) {
    profiles = await Promise.all(Array.from(prompts.keys()).map((userId) => fetchUser(userId)));
  }
  return history.map((record) => {
    const profile = profiles.find((p) => p.userId === record.userId);
    if (profile) record.setDisplayName(profile.displayName);
    return record.toString();
  }).join('\n');
};

const printFormattedHistory = async () => {
  if (history.length < 1) return;
  console.info(`\n${await getFormattedHistory()}`);
};

export {
  writeHistory,
  getFormattedHistory,
  printFormattedHistory,
};

export default history;
