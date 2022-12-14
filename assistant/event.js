import {
  COMMAND_VERSION,
  COMMAND_AI,
  COMMAND_AI_AUTO_REPLY_ON,
  COMMAND_AI_AUTO_REPLY_OFF,
} from '../constants/command/index.js';

class Event {
  replies = [];

  constructor({
    replyToken,
    source,
    message,
  }) {
    this.replyToken = replyToken;
    this.source = source;
    this.message = message;
  }

  get userId() {
    return this.source.userId;
  }

  get text() {
    return String(this.message.text);
  }

  get isCommandVersion() {
    return this.text.toLowerCase() === COMMAND_VERSION;
  }

  get isCommandAI() {
    return this.text.toLowerCase().startsWith(COMMAND_AI);
  }

  get isCommandAIAutoReplyOn() {
    return this.text.toLowerCase() === COMMAND_AI_AUTO_REPLY_ON;
  }

  get isCommandAIAutoReplyOff() {
    return this.text.toLowerCase() === COMMAND_AI_AUTO_REPLY_OFF;
  }

  pushReply(reply) {
    this.replies.push(reply);
  }
}

export default Event;
