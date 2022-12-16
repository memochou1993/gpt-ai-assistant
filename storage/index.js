import config from '../config/index.js';
import {
  createEnvironment,
  updateEnvironment,
} from '../services/vercel/index.js';
import {
  fetchEnvironment,
} from '../utils/index.js';

const ENV_KEY_APP_STORAGE = 'APP_STORAGE';

let memory = {};

const init = (data) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    memory = data;
    return;
  }
  try {
    createEnvironment({
      key: ENV_KEY_APP_STORAGE,
      value: JSON.stringify(data),
      type: 'plain',
    });
  } catch (err) {
    console.error(err);
  }
};

const getItem = async (key) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    return memory[key];
  }
  const env = await fetchEnvironment(ENV_KEY_APP_STORAGE);
  const data = JSON.parse(env.value);
  return data[key];
};

const setItem = async (key, value) => {
  if (!config.VERCEL_ACCESS_TOKEN) {
    memory[key] = value;
    return;
  }
  const env = await fetchEnvironment(ENV_KEY_APP_STORAGE);
  const data = JSON.parse(env.value);
  data[key] = value;
  await updateEnvironment({
    id: env.id,
    value: JSON.stringify(data),
    type: 'plain',
  });
};

const storage = {
  init,
  getItem,
  setItem,
};

export default storage;
