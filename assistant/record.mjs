class Record {
  constructor({ participant, text }) {
    this.participant = participant;
    this.text = text;
  }

  toString() {
    return `${this.participant}: ${this.text}`;
  }
}

export default Record;
