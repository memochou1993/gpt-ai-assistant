import { TYPE_SUM, TYPE_ANALYZE, TYPE_TRANSLATE } from '../../constants/command.js';

class Sentence {
  title;

  text;

  constructor({
    title,
    text,
  }) {
    this.title = title;
    this.text = text;
  }

  get isEnquiring() {
    return this.text === TYPE_SUM
    || this.text === TYPE_ANALYZE
    || this.text === TYPE_TRANSLATE;
  }

  toString() {
    return this.title ? `\n${this.title}: ${this.text}` : this.text;
  }
}

export default Sentence;
