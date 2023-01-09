class Record {
  title;

  text;

  constructor({
    title,
    text,
  }) {
    this.title = title;
    this.text = text;
  }

  toString() {
    return `${this.title}: ${this.text}`;
  }
}

export default Record;
