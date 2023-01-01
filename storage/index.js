import config from '../config/index.js';
import { SETTING_PREFIX } from '../constants/setting.js';
import { createEnvironment, ENV_TYPE_PLAIN, updateEnvironment } from '../services/vercel.js';
import { fetchEnvironment } from '../utils/index.js';

const ENVIRONMENT_KEY = 'APP_STORAGE';

class Storage {
  env;

  data = {};

  async initialize() {
    if (!config.VERCEL_ACCESS_TOKEN) return;
    // FIXME: experimental feature
    if (this.env) return;
    console.log('env is missing');
    const env = await fetchEnvironment(ENVIRONMENT_KEY);
    if (env) {
      this.env = env;
      this.data = JSON.parse(env.value);
      return;
    }
    await createEnvironment({
      key: ENVIRONMENT_KEY,
      value: JSON.stringify({}),
      type: ENV_TYPE_PLAIN,
    });
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
    this.data[key] = String(value);
    if (!config.VERCEL_ACCESS_TOKEN) return;
    await updateEnvironment({
      id: this.env.id,
      value: JSON.stringify(this.data),
      type: ENV_TYPE_PLAIN,
    });
  }

  /**
   * @param {string} key
   */
  removeItem(key) {
    if (!config.VERCEL_ACCESS_TOKEN) {
      delete this.data[key];
    }
  }
}

const storage = new Storage();

export default storage;
