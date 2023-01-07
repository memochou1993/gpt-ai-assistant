import { TYPE_ACTING, TYPE_ANALYZING, TYPE_TRANSLATING } from '../../constants/command.js';

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
    return this.text === TYPE_ACTING;
  }

  get isAnalyzing() {
    return this.text === TYPE_ANALYZING;
  }

  get isTranslating() {
    return this.text === TYPE_TRANSLATING;
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
