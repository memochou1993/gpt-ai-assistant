import config from '../config/index.js';

const addMark = (text) => {
  if (!text) return text;
  const marks = ['？', '。', '！', '?', '.', '!'];
  if (marks.some((mark) => text.endsWith(mark))) {
    return text;
  }
  if (config.APP_LANG === 'zh' || config.APP_LANG === 'ja') return `${text}。`;
  return `${text}.`;
};

export default addMark;
