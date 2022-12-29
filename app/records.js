import prompts from './prompts.js';
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

const records = [];

/**
 * @param {string} userId
 * @param {string} text
 */
const writeRecord = (userId, text) => {
  records.push(new Record({ userId, text }));
};

/**
 * @param {Object} param
 * @param {boolean} param.useDisplayName
 * @returns {Promise<string>}
 */
const getFormattedRecords = async ({ useDisplayName = false } = {}) => {
  let profiles = [];
  if (useDisplayName) {
    profiles = await Promise.all(Array.from(prompts.keys()).map((userId) => fetchUser(userId)));
  }
  return records.map((record) => {
    const profile = profiles.find((p) => p.userId === record.userId);
    if (profile) record.setDisplayName(profile.displayName);
    return record.toString();
  }).join('\n');
};

const printFormattedRecords = async () => {
  if (records.length < 1) return;
  console.info(`\n${await getFormattedRecords()}`);
};

export {
  writeRecord,
  getFormattedRecords,
  printFormattedRecords,
};

export default records;
