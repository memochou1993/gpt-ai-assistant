import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../services/openai.js';
import { SETTING_AI_AUTO_REPLY } from '../constants/setting.js';
import { deploy } from '../services/vercel.js';
import storage from '../storage/index.js';
import completePrompt from '../utils/complete-prompt.js';
import Event from './models/event.js';
import { getSession, setSession } from './sessions.js';
import getVersion from '../utils/get-version.js';
import { MESSAGE_TYPE_TEXT } from '../services/line.js';
import replyMessage from '../utils/reply-message.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const handleEvent = async (event) => {
  if (event.isCommandVersion) {
    event.pushReply(getVersion());
    return event;
  }
  if (event.isCommandDeploy) {
    await deploy();
    event.pushReply('deploying');
    return event;
  }
  if (event.isCommandAIAutoReplyOff) {
    await storage.setItem(SETTING_AI_AUTO_REPLY, false);
    event.pushReply('off');
    return event;
  }
  if (event.isCommandAIAutoReplyOn) {
    await storage.setItem(SETTING_AI_AUTO_REPLY, true);
    event.pushReply('on');
    return event;
  }
  if (event.isCommandAI || await storage.getItem(SETTING_AI_AUTO_REPLY)) {
    try {
      const session = getSession(event.userId);
      session.write(`${PARTICIPANT_HUMAN}: ${event.text}？`);
      const { text } = await completePrompt({ prompt: session.toString() });
      session.write(`${PARTICIPANT_AI}: ${text}`);
      setSession(event.userId, session);
      event.pushReply(text);
      return event;
    } catch (err) {
      event.pushReply(err.message);
      return event;
    }
  }
  return event;
};

/**
 * @param {Event} event
 * @returns {Event}
 */
const replyEvent = (event) => replyMessage({
  replyToken: event.replyToken,
  messages: event.replies.map((reply) => ({
    type: MESSAGE_TYPE_TEXT,
    text: reply,
  })),
});

const handleEvents = async (events = []) => Promise.all(
  (await Promise.all(
    events
      .map((event) => new Event(event))
      .filter((event) => event.isEventTypeMessage)
      .filter((event) => event.isMessageTypeText)
      .map((event) => handleEvent(event)),
  ))
    .filter((event) => event.replies.length > 0)
    .map((event) => replyEvent(event)),
);

export default handleEvents;
