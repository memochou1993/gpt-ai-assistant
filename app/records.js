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
 * @returns {Promise<string>}
 */
const getFormattedRecords = async () => records.map((record) => record.toString()).join('\n');

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
