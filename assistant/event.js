import {
  COMMAND_GET_VERSION,
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

  get isCommandGetVersion() {
    return this.text.toLowerCase() === COMMAND_GET_VERSION;
  }

  pushReply(reply) {
    this.replies.push(reply);
  }
}

export default Event;
