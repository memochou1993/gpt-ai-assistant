import config from '../config/index.js';
import {
  createEnvironment,
  updateEnvironment,
} from '../services/vercel.js';
import {
  fetchEnvironment,
} from '../utils/index.js';

const ENV_KEY = 'APP_STORAGE';

let memory = {};

const initialize = async (data) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    memory = data;
    return;
  }
  try {
    await createEnvironment({
      key: ENV_KEY,
      value: JSON.stringify(data),
      type: 'plain',
    });
  } catch { /* empty */ }
};

const getItem = async (key) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    return memory[key];
  }
  const env = await fetchEnvironment(ENV_KEY);
  const data = JSON.parse(env.value);
  return data[key];
};

const setItem = async (key, value) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    memory[key] = value;
    return;
  }
  const env = await fetchEnvironment(ENV_KEY);
  const data = JSON.parse(env.value);
  data[key] = value;
  await updateEnvironment({
    id: env.id,
    value: JSON.stringify(data),
    type: 'plain',
  });
};

const storage = {
  initialize,
  getItem,
  setItem,
};

export default storage;
