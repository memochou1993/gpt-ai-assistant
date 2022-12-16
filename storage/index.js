import config from '../config/index.js';
import {
  createEnvironment,
  fetchEnvironments,
  updateEnvironment,
} from '../services/vercel/index.js';

const ENV_KEY = 'APP_STORAGE';

const fetchEnvironment = async (key) => {
  const { data } = await fetchEnvironments();
  return data.envs.find((env) => env.key === key);
};

class Storage {
  env;

  data = {};

  constructor(data) {
    this.data = data;
    this.init();
  }

  async init() {
    if (!config.VERCEL_API_KEY) return;
    try {
      const { data } = await createEnvironment({
        key: ENV_KEY,
        value: JSON.stringify(this.data),
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

  async retrieve() {
    this.env = await fetchEnvironment(ENV_KEY);
    this.data = JSON.parse(this.env.value);
  }

  async getItem(key) {
    if (!config.VERCEL_API_KEY) {
      return this.data[key];
    }
    if (!this.env) await this.retrieve();
    return this.data[key];
  }

  async setItem(key, value) {
    this.data[key] = value;
    if (!config.VERCEL_API_KEY) {
      return;
    }
    if (!this.env) await this.retrieve();
    const { data } = await updateEnvironment({
      id: this.env.id,
      value: JSON.stringify(this.data),
      type: 'plain',
    });
    this.env = data;
  }
}

export default Storage;
