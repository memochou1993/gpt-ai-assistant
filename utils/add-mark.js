import config from '../config/index.js';

const addMark = (text) => {
  if (!text) return text;
  const marks = ['？', '。', '！', '?', '.', '!'];
  if (marks.some((mark) => text.endsWith(mark))) {
    return text;
  }
  switch (config.APP_LANG) {
    case 'zh':
    case 'zh_TW':
    case 'zh_CN':
    case 'ja':
      return `${text}。`;
    default:
      return `${text}.`;
  }
};

export default addMark;
