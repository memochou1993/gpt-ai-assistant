import { MESSAGE_TYPE_TEXT } from '../../services/line.js';
import Message from './message.js';

class TextMessage extends Message {
  type = MESSAGE_TYPE_TEXT;

  text;

  constructor({
    text,
  }) {
    super();
    this.text = text;
  }
}

export default TextMessage;
