import {
  COMMAND_AI,
  COMMAND_AI_AUTO_REPLY_OFF,
  COMMAND_AI_AUTO_REPLY_ON,
  COMMAND_VERSION,
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

  get input() {
    return String(this.message.text);
  }

  get text() {
    return this.input.substring(this.input.indexOf(' ') + 1);
  }

  get isCommandVersion() {
    return this.input === COMMAND_VERSION;
  }

  get isCommandAI() {
    return this.input.startsWith(COMMAND_AI);
  }

  get isCommandAIAutoReplyOn() {
    return this.input === COMMAND_AI_AUTO_REPLY_ON;
  }

  get isCommandAIAutoReplyOff() {
    return this.input === COMMAND_AI_AUTO_REPLY_OFF;
  }

  pushReply(reply) {
    this.replies.push(reply);
  }
}

export default Event;
