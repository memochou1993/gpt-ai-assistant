export const SENTENCE_PROMPTING = 'prompting';
export const SENTENCE_ACTING = 'acting';
export const SENTENCE_ANALYZING = 'analyzing';

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
    return this.text === SENTENCE_ACTING;
  }

  get isAnalyzing() {
    return this.text === SENTENCE_ANALYZING;
  }

  get isEnquiring() {
    return this.isActing || this.isAnalyzing;
  }

  toString() {
    return this.title ? `\n${this.title}: ${this.text}` : this.text;
  }
}

export default Sentence;
