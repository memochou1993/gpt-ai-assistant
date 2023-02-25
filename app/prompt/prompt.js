import { encode } from 'gpt-3-encoder';
import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import Sentence from './sentence.js';

const MAX_SENTENCES = config.APP_MAX_PROMPT_SENTENCES;
const MAX_TOKENS = config.APP_MAX_PROMPT_TOKENS;

class Prompt {
  sentences = [];

  constructor() {
    this
      .write(PARTICIPANT_HUMAN, `${t('__COMPLETION_DEFAULT_HUMAN_GREETING')(config.HUMAN_NAME)}${config.HUMAN_INIT_PROMPT}。`)
      .write(PARTICIPANT_AI, `${t('__COMPLETION_DEFAULT_AI_GREETING')(config.BOT_NAME)}${config.BOT_INIT_PROMPT}。`);
  }

  /**
   * @returns {Sentence}
   */
  get lastSentence() {
    return this.sentences.length > 0 ? this.sentences[this.sentences.length - 1] : null;
  }

  get tokenCount() {
    const encoded = encode(this.toString());
    return encoded.length;
  }

  erase() {
    if (this.sentences.length > 0) {
      this.sentences.pop();
    }
    return this;
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  write(title, text = '') {
    if (this.sentences.length >= MAX_SENTENCES || this.tokenCount >= MAX_TOKENS) {
      this.sentences.splice(2, 1);
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
