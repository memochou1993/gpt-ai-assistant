import Record from './record.mjs';

const LIMIT = 20;

class History {
  records = [];

  push(participant, text) {
    if (this.records.length >= LIMIT) {
      this.records.shift();
    }
    this.records.push(new Record({ participant, text }));
  }

  toString() {
    return this.records.map((sentence) => `${sentence.toString()}\n`).join('');
  }
}

export default History;
