import config from '../config/index.js';
import {
  createEnvironment,
  fetchEnvironments,
  updateEnvironment,
} from '../services/vercel/index.js';

const ENV_KEY = 'APP_STORAGE';

export const KEY_AI_AUTO_REPLY = 'AI_AUTO_REPLY';

const fetchEnvironment = async (key) => {
  const { data } = await fetchEnvironments();
  return data.envs.find((env) => env.key === key);
};

class Storage {
  env;

  data;

  constructor() {
    if (config.APP_ENV !== 'production' || !config.VERCEL_API_KEY) return;
    this.initialize();
  }

  async initialize() {
    try {
      const item = {};
      item[KEY_AI_AUTO_REPLY] = true;
      const { data } = await createEnvironment({
        key: ENV_KEY,
        value: JSON.stringify(item),
        type: 'plain',
      });
      this.env = data.created;
    } catch {
      try {
        this.env = await fetchEnvironment(ENV_KEY);
      } catch (err) {
        console.error(err);
      }
    }
    this.data = JSON.parse(this.env.value);
  }

  async getItem(key) {
    if (config.APP_ENV !== 'production' || !config.VERCEL_API_KEY) {
      return this.data[key];
    }
    return this.data[key];
  }

  async setItem(key, value) {
    if (config.APP_ENV !== 'production' || !config.VERCEL_API_KEY) {
      this.data[key] = value;
      return;
    }
    this.data[key] = value;
    const { data } = await updateEnvironment({
      id: this.env.id,
      value: JSON.stringify(this.data),
      type: 'plain',
    });
    this.env = data;
    this.data = JSON.parse(this.env.value);
  }
}

const setting = new Storage();

export default setting;
