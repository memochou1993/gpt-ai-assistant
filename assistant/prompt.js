import {
  PARTICIPANT_AI,
} from '../services/openai.js';
import {
  OPENAI_COMPLETION_LANG,
} from '../config/index.js';

const LIMIT = 20;

const LANGUAGES = {
  zh: '嗨',
  en: 'Hi',
};

class Prompt {
  lines = [];

  constructor() {
    this.write(`${PARTICIPANT_AI}: ${LANGUAGES[OPENAI_COMPLETION_LANG]}`);
  }

  write(text) {
    if (this.lines.length >= LIMIT) {
      this.lines.shift();
    }
    this.lines.push(text);
  }

  toString() {
    return this.lines.map((line) => `${line}\n`).join('');
  }
}

export default Prompt;
