import { QUICK_REPLY_TYPE_ACTION } from '../../services/line.js';
import { Action } from '../actions/index.js';

class Message {
  quickReply;

  /**
   * @param {Array<Action>} actions
   */
  setQuickReply(actions = []) {
    if (actions.length < 1) return;
    this.quickReply = {
      items: actions.map((action) => ({
        type: QUICK_REPLY_TYPE_ACTION,
        action,
      })),
    };
  }
}

export default Message;
