import { QUICK_REPLY_TYPE_ACTION } from '../../services/line.js';
import { MessageAction } from '../actions/index.js';
import { Command } from '../commands/index.js';

class Message {
  type;

  quickReply;

  /**
   * @param {Array<Command>} actions
   */
  setQuickReply(actions = []) {
    if (actions.length < 1) return;
    this.quickReply = {
      items: actions.map((action) => ({
        type: QUICK_REPLY_TYPE_ACTION,
        action: new MessageAction(action),
      })),
    };
  }
}

export default Message;
