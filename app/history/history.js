import Record from './record.js';

const MAX_RECORD_COUNT = 8;

class History {
  records = [];

  /**
   * @returns {Record}
   */
  get lastRecord() {
    return this.records.length > 0 ? this.records[this.records.length - 1] : null;
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  write(title, text) {
    if (this.records.length >= MAX_RECORD_COUNT) {
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
