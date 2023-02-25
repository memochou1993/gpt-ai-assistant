import { encode } from 'gpt-3-encoder';
import config from '../../config/index.js';
import Record from './record.js';

const MAX_RECORDS = config.APP_MAX_PROMPT_SENTENCES / 2;
const MAX_TOKENS = config.APP_MAX_PROMPT_TOKENS / 2;

class History {
  records = [];

  /**
   * @returns {Record}
   */
  get lastRecord() {
    return this.records.length > 0 ? this.records[this.records.length - 1] : null;
  }

  get tokenCount() {
    const encoded = encode(this.toString());
    return encoded.length;
  }

  erase() {
    if (this.records.length > 0) {
      this.records.pop();
    }
    return this;
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  write(title, text) {
    if (this.records.length >= MAX_RECORDS || this.tokenCount >= MAX_TOKENS) {
      this.records.shift();
    }
    this.records.push(new Record({ title, text }));
    return this;
  }

  /**
   * @param {string} text
   */
  patch(text) {
    if (this.records.length < 1) return;
    this.records[this.records.length - 1].text += text;
  }

  toString() {
    return this.records.map((record) => record.toString()).join('\n');
  }
}

export default History;
