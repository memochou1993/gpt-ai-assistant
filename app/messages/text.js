import { MESSAGE_TYPE_TEXT } from '../../services/line.js';
import Message from './message.js';

class Text extends Message {
  type;

  text;

  constructor({
    text,
  }) {
    super();
    this.type = MESSAGE_TYPE_TEXT;
    this.text = text;
  }
}

export default Text;
