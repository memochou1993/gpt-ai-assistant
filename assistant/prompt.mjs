import {
  PARTICIPANT_AI,
} from '../services/openai.mjs';

const LIMIT = 20;

class Prompt {
  lines = [];

  constructor() {
    this.write(`${PARTICIPANT_AI}: 嗨！我可以怎麼幫助你？`);
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
