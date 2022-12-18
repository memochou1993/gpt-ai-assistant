import config from '../../config/index.js';
import { PARTICIPANT_AI } from '../../services/openai.js';

const INIT_MESSAGES = {
  zh: '哈囉！',
  en: 'Hello!',
  ja: 'こんにちは！',
};

const MAX_LINE_COUNT = 10;

class Session {
  lines = [];

  constructor() {
    this.write(`${PARTICIPANT_AI}: ${INIT_MESSAGES[config.OPENAI_COMPLETION_INIT_LANG]}`);
  }

  write(text) {
    if (this.lines.length >= MAX_LINE_COUNT) {
      this.lines.shift();
    }
    this.lines.push(text);
  }

  toString() {
    return this.lines.map((line) => `${line}\n`).join('');
  }
}

export default Session;
