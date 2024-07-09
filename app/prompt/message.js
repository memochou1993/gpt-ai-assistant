import { TYPE_ANALYZE, TYPE_SUM, TYPE_TRANSLATE } from '../../constants/command.js';

class Message {
  role;

  content;

  constructor({
    role,
    content,
  }) {
    this.role = role;
    this.content = content;
  }

  get isEnquiring() {
    return this.content === TYPE_SUM
    || this.content === TYPE_ANALYZE
    || this.content === TYPE_TRANSLATE;
  }

  toString() {
    if (Array.isArray(this.content)) {
      return `\n${this.role}: ${this.content[0].text}`;
    }
    return this.role ? `\n${this.role}: ${this.content}` : this.content;
  }
}

export default Message;
