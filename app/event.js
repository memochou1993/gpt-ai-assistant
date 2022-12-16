import {
  COMMAND_AI, COMMAND_AI_AUTO_REPLY_OFF, COMMAND_AI_AUTO_REPLY_ON, COMMAND_DEPLOY, COMMAND_VERSION,
} from '../constants/command.js';
import { EVENT_TYPE_MESSAGE, MESSAGE_TYPE_TEXT } from '../services/line.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../services/openai.js';
import { deploy } from '../services/vercel.js';
import storage from '../storage/index.js';
import completePrompt from '../utils/complete-prompt.js';
import getVersion from '../utils/get-version.js';
import replyMessage from '../utils/reply-message.js';
import { getSession, setSession } from './sessions.js';
import { SETTING_AI_AUTO_REPLY } from '../constants/setting.js';

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

  get isEventTypeMessage() {
    return this.type === EVENT_TYPE_MESSAGE;
  }

  get isMessageTypeText() {
    return this.message.type === MESSAGE_TYPE_TEXT;
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

  get isCommandDeploy() {
    return this.input === COMMAND_DEPLOY;
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

  /**
   * @param {Event} event
   * @returns {Event}
   */
  async handle() {
    if (this.isCommandVersion) {
      this.pushReply(getVersion());
      return this;
    }
    if (this.isCommandDeploy) {
      await deploy();
      this.pushReply('deploying');
      return this;
    }
    if (this.isCommandAIAutoReplyOff) {
      await storage.setItem(SETTING_AI_AUTO_REPLY, false);
      this.pushReply('off');
      return this;
    }
    if (this.isCommandAIAutoReplyOn) {
      await storage.setItem(SETTING_AI_AUTO_REPLY, true);
      this.pushReply('on');
      return this;
    }
    if (this.isCommandAI || await storage.getItem(SETTING_AI_AUTO_REPLY)) {
      try {
        const session = getSession(this.userId);
        session.write(`${PARTICIPANT_HUMAN}: ${this.text}？`);
        const { text } = await completePrompt({ prompt: session.toString() });
        session.write(`${PARTICIPANT_AI}: ${text}`);
        setSession(this.userId, session);
        this.pushReply(text);
        return this;
      } catch (err) {
        this.pushReply(err.message);
        return this;
      }
    }
    return this;
  }

  reply() {
    return replyMessage({
      replyToken: this.replyToken,
      messages: this.replies.map((reply) => ({
        type: MESSAGE_TYPE_TEXT,
        text: reply,
      })),
    });
  }

  pushReply(reply) {
    this.replies.push(reply);
  }
}

export default Event;
