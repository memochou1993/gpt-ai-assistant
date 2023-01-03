import storage from '../../storage/index.js';
import { Source } from '../models/index.js';

const FIELD_KEY = 'sources';

/**
 * @returns {Object.<string, Source>}
 */
const getSources = () => storage.getItem(FIELD_KEY) || {};

/**
 * @param {Object.<string, Source>} sources
 */
const setSources = (sources) => storage.setItem(FIELD_KEY, sources);

/**
 * @param {string} contextId
 * @param {function(Source)} callback
 */
const updateSources = async (contextId, callback) => {
  const sources = getSources();
  callback(sources[contextId]);
  await setSources(sources);
};

export {
  getSources,
  setSources,
  updateSources,
};
