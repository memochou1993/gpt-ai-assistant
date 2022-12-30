class History {
  lines = [];

  toString() {
    return this.lines.join('\n');
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
 * @param {string} displayName
 * @param {string} text
 */
const writeHistory = (contextId, displayName, text) => {
  const history = getHistory(contextId);
  history.lines.push(`${displayName}: ${text}`);
  histories.set(contextId, history);
};

/**
 * @returns {string}
 */
const getFormattedHistory = (contextId) => getHistory(contextId).toString();

const printFormattedHistories = () => {
  if (Array.from(histories.keys()).length < 1) return;
  const content = Array.from(histories.keys()).map((contextId) => `\n=== ${contextId.slice(0, 6)} ===\n\n${getFormattedHistory(contextId)}`).join('\n');
  console.info(content);
};

export {
  writeHistory,
  getFormattedHistory,
  printFormattedHistories,
};

export default histories;
