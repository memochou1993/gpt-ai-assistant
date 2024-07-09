import { encode } from 'gpt-3-encoder';
import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { addMark } from '../../utils/index.js';
import Message from './message.js';

const MAX_MESSAGES = config.APP_MAX_PROMPT_MESSAGES / 2;
const MAX_TOKENS = config.APP_MAX_PROMPT_TOKENS / 2;

class History {
  messages = [];

  /**
   * @returns {Message}
   */
  get lastMessage() {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
  }

  get tokenCount() {
    const encoded = encode(this.toString());
    return encoded.length;
  }

  erase() {
    if (this.messages.length > 0) {
      this.messages.pop();
    }
    return this;
  }

  /**
   * @param {string} role
   * @param {string} content
   */
  write(role, content) {
    if (this.messages.length >= MAX_MESSAGES || this.tokenCount >= MAX_TOKENS) {
      this.messages.shift();
    }
    this.messages.push(new Message({ role, content: addMark(content) }));
    return this;
  }

  /**
   * @param {string} role
   * @param {string} content
   */
  writeImage(role, content = '') {
    const imageContent = [
      {
        type: 'text',
        text: t('__COMPLETION_VISION'),
      },
      {
        type: 'image',
        image_url: {
          url: content,
        },
      },
    ];
    this.messages.push(new Message({ role, content: imageContent }));
    return this;
  }

  /**
   * @param {string} content
   */
  patch(content) {
    if (this.messages.length < 1) return;
    this.messages[this.messages.length - 1].content += content;
  }

  toString() {
    return this.messages.map((record) => record.toString()).join('\n');
  }
}

export default History;
