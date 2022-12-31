export const SENTENCE_PROMPTING = 'prompting';
export const SENTENCE_ENQUIRING = 'enquiring';

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

  get isEnquiring() {
    return this.text === SENTENCE_ENQUIRING;
  }

  toString() {
    return this.title ? `\n${this.title}: ${this.text}` : this.text;
  }
}

export default Sentence;
