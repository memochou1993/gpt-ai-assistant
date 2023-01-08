import { TYPE_ACT, TYPE_ANALYZE, TYPE_TRANSLATE } from '../../constants/command.js';

class Sentence {
  type;

  title;

  text;

  constructor({
    type,
    title,
    text,
  }) {
    this.type = type;
    this.title = title;
    this.text = text;
  }

  get isActing() {
    return this.text === TYPE_ACT;
  }

  get isAnalyzing() {
    return this.text === TYPE_ANALYZE;
  }

  get isTranslating() {
    return this.text === TYPE_TRANSLATE;
  }

  get isEnquiring() {
    return this.isActing
    || this.isAnalyzing
    || this.isTranslating;
  }

  toString() {
    return this.title ? `\n${this.title}: ${this.text}` : this.text;
  }
}

export default Sentence;
