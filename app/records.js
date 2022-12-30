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

  toString() {
    return `${this.displayName || this.userId}: ${this.text}`;
  }
}

const records = new Map();

/**
 * @param {string} contextId
 * @returns {Record}
 */
const getRecords = (contextId) => records.get(contextId) || [];

/**
 * @param {string} contextId
 * @param {string} userId
 * @param {string} text
 */
const writeRecord = (contextId, userId, text) => {
  const history = getRecords(contextId);
  history.push(new Record({ userId, text }));
  records.set(contextId, history);
};

/**
 * @returns {string}
 */
const getFormattedRecords = (contextId) => getRecords(contextId).map((record) => record.toString()).join('\n');

const printFormattedRecords = () => {
  if (Array.from(records.keys()).length < 1) return;
  const content = Array.from(records.keys()).map((contextId) => `=== ${contextId.slice(6)} ===\n${getFormattedRecords(contextId)}`);
  console.info(`\n${content}`);
};

export {
  writeRecord,
  getFormattedRecords,
  printFormattedRecords,
};

export default records;
