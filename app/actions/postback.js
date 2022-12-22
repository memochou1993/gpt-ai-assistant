import Action from './action.js';

class PostbackAction extends Action {
  label;

  data;

  constructor({
    label,
    text,
  }) {
    super();
    this.label = label;
    this.data = JSON.stringify({ action: text });
  }
}

export default PostbackAction;
