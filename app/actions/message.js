import Action from './action.js';

class MessageAction extends Action {
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
