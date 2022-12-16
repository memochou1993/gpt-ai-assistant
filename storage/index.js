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
    if (!config.VERCEL_ACCESS_TOKEN) return;
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

  async getItem(key) {
    if (!config.VERCEL_ACCESS_TOKEN) {
      return this.data[key];
    }
    console.log('getItem this.env', this.env);
    if (!this.env) {
      this.env = await fetchEnvironment(ENV_KEY);
      console.log('getItem this.env.value', this.env.value);
      this.data = JSON.parse(this.env.value);
      console.log('getItem this.data', this.data);
    }
    console.log('getItem this.data 2', this.data);
    return this.data[key];
  }

  async setItem(key, value) {
    if (!config.VERCEL_ACCESS_TOKEN) {
      this.data[key] = value;
      return;
    }
    if (!this.env) {
      this.env = await fetchEnvironment(ENV_KEY);
      this.data = JSON.parse(this.env.value);
    }
    this.data[key] = value;
    const { data } = await updateEnvironment({
      id: this.env.id,
      value: JSON.stringify(this.data),
      type: 'plain',
    });
    this.env = data;
    console.log('setItem this.env', this.env);
  }
}

export default Storage;
