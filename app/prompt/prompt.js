import { t } from '../../locales/index.js';
import { PARTICIPANT_AI } from '../../services/openai.js';
import Sentence from './sentence.js';

const MAX_LINE_COUNT = 16;

class Prompt {
  sentences = [];

  constructor() {
    this.write(PARTICIPANT_AI, t('__COMPLETION_INIT_MESSAGE'));
  }

  /**
   * @returns {Sentence}
   */
  get lastSentence() {
    return this.sentences.length > 0 ? this.sentences[this.sentences.length - 1] : null;
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  write(title, text = '') {
    if (this.sentences.length >= MAX_LINE_COUNT) {
      this.sentences.shift();
    }
    this.sentences.push(new Sentence({ title, text }));
    return this;
  }

  /**
   * @param {string} text
   */
  patch(text) {
    this.sentences[this.sentences.length - 1].text += text;
  }

  toString() {
    return this.sentences.map((sentence) => sentence.toString()).join('');
  }
}

export default Prompt;
