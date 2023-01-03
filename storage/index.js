import config from '../config/index.js';
import { createEnvironment, ENV_TYPE_PLAIN, updateEnvironment } from '../services/vercel.js';
import { fetchEnvironment } from '../utils/index.js';

const ENV_KEY = 'APP_STORAGE';

class Storage {
  env;

  data = {};

  async initialize() {
    if (!config.VERCEL_ACCESS_TOKEN) return;
    this.env = await fetchEnvironment(ENV_KEY);
    if (!this.env) {
      const { data } = await createEnvironment({
        key: ENV_KEY,
        value: JSON.stringify(this.data),
        type: ENV_TYPE_PLAIN,
      });
      this.env = data.created;
    }
    this.data = JSON.parse(this.env.value);
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  getItem(key) {
    return this.data[key];
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  async setItem(key, value) {
    this.data[key] = value;
    if (!config.VERCEL_ACCESS_TOKEN) return;
    await updateEnvironment({
      id: this.env.id,
      value: JSON.stringify(this.data, null, config.VERCEL_ENV ? 0 : 2),
      type: ENV_TYPE_PLAIN,
    });
  }
}

const storage = new Storage();

export default storage;
