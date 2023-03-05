import * as OpenCC from 'opencc-js';
import config from '../config/index.js';

const convertText = (text) => {
  if (config.APP_LANG !== 'zh') return text;
  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
  return converter(text);
};

export default convertText;
