import config from '../config/index.js';
import { createEnvironment, ENV_TYPE_PLAIN, updateEnvironment } from '../services/vercel.js';
import { fetchEnvironment } from '../utils/index.js';

const memory = {};

const getItem = async (key, useEnv) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    return memory[key];
  }
  if (useEnv) {
    return config.APP_STORAGE[key];
  }
  const env = await fetchEnvironment(key);
  return env?.value;
};

const setItem = async (key, value) => {
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

const storage = {
  getItem,
  setItem,
};

export default storage;
