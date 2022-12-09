import Record from './record.mjs';

class History {
  records = [];

  push(participant, text) {
    this.records.push(new Record({ participant, text }));
  }

  toString() {
    return this.records.map((sentence) => `${sentence.toString()}\n`).join('');
  }
}

export default History;
