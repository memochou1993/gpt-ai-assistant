import * as OpenCC from 'opencc-js';
import config from '../config/index.js';

const convertText = (text) => {
  if (config.APP_LANG === 'zh_TW') {
    const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
    return converter(text);
  }
  if (config.APP_LANG === 'zh_CN') {
    const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
    return converter(text);
  }
  return text;
};

export default convertText;
