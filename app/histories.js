// eslint-disable-next-line max-classes-per-file
const MAX_RECORD_COUNT = 16;

// FIXME
class Record {
  title;

  text;

  constructor({
    title,
    text,
  }) {
    this.title = title;
    this.text = text;
  }

  toString() {
    return `${this.title}: ${this.text}`;
  }
}

class History {
  records = [];

  write(displayName, text) {
    if (this.records.length >= MAX_RECORD_COUNT) {
      this.records.shift();
    }
    this.records.push(new Record({ title: displayName, text }));
    return this;
  }

  toString() {
    return this.records.map((record) => record.toString()).join('\n');
  }
}

const histories = new Map();

/**
 * @param {string} contextId
 * @returns {History}
 */
const getHistory = (contextId) => histories.get(contextId) || new History();

/**
 * @param {string} contextId
 * @param {History} history
 * @returns {History}
 */
const setHistory = (contextId, history) => histories.set(contextId, history);

/**
 * @param {string} contextId
 * @param {function(History)} callback
 */
const updateHistory = (contextId, callback) => {
  const history = getHistory(contextId);
  callback(history);
  setHistory(contextId, history);
};

const printHistories = () => {
  const records = Array.from(histories.keys())
    .filter((contextId) => getHistory(contextId).records.length > 0)
    .map((contextId) => `\n=== ${contextId.slice(0, 6)} ===\n\n${getHistory(contextId).toString()}`);
  if (records.length < 1) return;
  console.info(records.join('\n'));
};

export {
  getHistory,
  updateHistory,
  printHistories,
};

export default histories;
