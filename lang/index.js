import config from '../config/index.js';
import en from './en.js';
import ja from './ja.js';
import zh from './zh.js';

const locales = {
  en,
  ja,
  zh,
};

const t = (key) => locales[config.APP_LANG][key];

export {
  t,
};

export default null;
