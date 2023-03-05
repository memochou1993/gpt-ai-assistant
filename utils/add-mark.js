import config from '../config/index.js';

const addMark = (text) => {
  const marks = ['？', '。', '！', '?', '.', '!'];
  if (marks.some((mark) => text.endsWith(mark))) {
    return text;
  }
  if (config.APP_LANG === 'zh' || config.APP_LANG === 'ja') return '。';
  return '.';
};

export default addMark;
