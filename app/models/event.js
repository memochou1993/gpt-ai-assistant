import {
  COMMAND_AI, COMMAND_AI_AUTO_REPLY_OFF, COMMAND_AI_AUTO_REPLY_ON, COMMAND_DEPLOY, COMMAND_VERSION,
} from '../../constants/command.js';
import { EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT } from '../../services/line.js';

class Event {
  replies = [];

  constructor({
    replyToken,
    type,
    source,
    message,
  }) {
    this.replyToken = replyToken;
    this.type = type;
    this.source = source;
    this.message = message;
  }

  /**
   * @returns {boolean}
   */
  get isEventTypeMessage() {
    return this.type === EVENT_TYPE_MESSAGE;
  }

  /**
   * @returns {boolean}
   */
  get isMessageTypeText() {
    return this.message.type === MESSAGE_TYPE_TEXT;
  }

  /**
   * @returns {string}
   */
  get userId() {
    return this.source.userId;
  }

  /**
   * @returns {string}
   */
  get input() {
    return this.message.text;
  }

  /**
   * @returns {string}
   */
  get text() {
    return this.input.substring(this.input.indexOf(' ') + 1);
  }

  /**
   * @returns {boolean}
   */
  get isCommandVersion() {
    return this.input === COMMAND_VERSION;
  }

  /**
   * @returns {boolean}
   */
  get isCommandDeploy() {
    return this.input === COMMAND_DEPLOY;
  }

  /**
   * @returns {boolean}
   */
  get isCommandAI() {
    return this.input.startsWith(COMMAND_AI);
  }

  /**
   * @returns {boolean}
   */
  get isCommandAIAutoReplyOn() {
    return this.input === COMMAND_AI_AUTO_REPLY_ON;
  }

  /**
   * @returns {boolean}
   */
  get isCommandAIAutoReplyOff() {
    return this.input === COMMAND_AI_AUTO_REPLY_OFF;
  }

  /**
 * @param {string} reply
   */
  pushReply(reply) {
    this.replies.push(reply);
  }
}

export default Event;
