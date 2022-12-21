import { MESSAGE_TYPE_TEXT } from '../../services/line.js';

class Text {
  type;

  text;

  quickReply;

  constructor({
    text,
    replyActions = [],
  }) {
    this.type = MESSAGE_TYPE_TEXT;
    this.text = text;
    if (replyActions.length > 0) {
      this.quickReply = {
        items: replyActions,
      };
    }
  }
}

export default Text;
