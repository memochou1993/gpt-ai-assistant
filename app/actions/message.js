import { ACTION_TYPE_MESSAGE } from '../../services/line.js';
import Action from './action.js';

class MessageAction extends Action {
  type = ACTION_TYPE_MESSAGE;

  label;

  text;

  constructor({
    label,
    text,
  }) {
    super();
    this.label = label;
    this.text = text;
  }
}

export default MessageAction;
