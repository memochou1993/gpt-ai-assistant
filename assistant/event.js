import {
  COMMAND_GET_VERSION,
  COMMAND_GET_ENV,
  COMMAND_SET_ENV,
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

  get isCommandGetEnv() {
    return this.text.toLowerCase() === COMMAND_GET_ENV;
  }

  get isCommandSetEnv() {
    return this.text.toLowerCase().startsWith(COMMAND_SET_ENV);
  }

  get getCommandArgs() {
    return this.text.slice(COMMAND_SET_ENV.length).trim().split('=');
  }

  handleCommandGetEnv(config) {
    this.pushReply(`${JSON.stringify(config, null, 2)}`);
  }

  handleCommandSetEnv(config) {
    const [key, value] = this.getCommandArgs;
    config.set(key, value);
    this.pushReply(`${key}=${config.get(key)}`);
    return this;
  }

  pushReply(reply) {
    this.replies.push(reply);
  }
}

export default Event;
