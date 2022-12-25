import config from '../config/index.js';
import { SETTING_PREFIX } from '../constants/setting.js';
import { createEnvironment, ENV_TYPE_PLAIN, updateEnvironment } from '../services/vercel.js';
import { fetchEnvironment } from '../utils/index.js';

const memory = {};

/**
 * @param {string} key
 * @param {Object} param
 * @param {boolean} param.useConfig
 * @returns {Promise<string>}
 */
const getItem = async (key, { useConfig } = {}) => {
  if (!key.startsWith(SETTING_PREFIX)) return undefined;
  if (useConfig) return config[key];
  if (!config.VERCEL_ACCESS_TOKEN) return memory[key];
  const env = await fetchEnvironment(key);
  return env?.value;
};

/**
 * @param {string} key
 * @param {string} value
 */
const setItem = async (key, value) => {
  if (!key.startsWith(SETTING_PREFIX)) return;
  if (!config.VERCEL_ACCESS_TOKEN) {
    memory[key] = String(value);
    return;
  }
  const env = await fetchEnvironment(key);
  if (env) {
    await updateEnvironment({
      id: env.id,
      value,
      type: ENV_TYPE_PLAIN,
    });
    return;
  }
  await createEnvironment({
    key,
    value,
    type: ENV_TYPE_PLAIN,
  });
};

const removeItem = (key) => {
  if (!key.startsWith(SETTING_PREFIX)) return;
  if (!config.VERCEL_ACCESS_TOKEN) {
    delete memory[key];
  }
};

const storage = {
  getItem,
  setItem,
  removeItem,
};

export default storage;
