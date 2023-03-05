const addMark = (text) => {
  const marks = ['？', '。', '！', '?', '.', '!'];
  if (marks.some((mark) => text.endsWith(mark))) {
    return text;
  }
  return `${text}.`;
};

export default addMark;
