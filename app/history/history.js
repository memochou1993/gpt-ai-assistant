import Record from './record.js';

const MAX_RECORD_COUNT = 16;

class History {
  records = [];

  write(displayName, text) {
    if (this.records.length >= MAX_RECORD_COUNT) {
      this.records.shift();
    }
    this.records.push(new Record({ title: displayName, text }));
    return this;
  }

  toString() {
    return this.records.map((record) => record.toString()).join('\n');
  }
}

export default History;
