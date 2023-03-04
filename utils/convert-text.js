import * as OpenCC from 'opencc-js';

const convertText = (text) => {
  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
  return converter(text);
};

export default convertText;
