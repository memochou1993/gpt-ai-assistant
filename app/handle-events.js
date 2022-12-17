import { SETTING_AI_AUTO_REPLY } from '../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../services/openai.js';
import { deploy } from '../services/vercel.js';
import storage from '../storage/index.js';
import {
  getVersion, generateCompletion, generateImage, replyMessage,
} from '../utils/index.js';
import Event from './models/event.js';
import { getSession, setSession } from './sessions.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const handleEvent = async (event) => {
  if (event.isCommandVersion) {
    const version = getVersion();
    event.sendText(version);
    return event;
  }
  if (event.isCommandDeploy) {
    await deploy();
    event.sendText('deploying');
    return event;
  }
  if (event.isCommandImage) {
    const { url } = await generateImage({ prompt: event.text });
    event.sendImage(url);
    return event;
  }
  if (event.isCommandAIAutoReplyOff) {
    await storage.setItem(SETTING_AI_AUTO_REPLY, false);
    event.sendText('off');
    return event;
  }
  if (event.isCommandAIAutoReplyOn) {
    await storage.setItem(SETTING_AI_AUTO_REPLY, true);
    event.sendText('on');
    return event;
  }
  if (event.isCommandAI || await storage.getItem(SETTING_AI_AUTO_REPLY)) {
    try {
      const session = getSession(event.userId);
      session.write(`${PARTICIPANT_HUMAN}: ${event.text}？`);
      const { text } = await generateCompletion({ prompt: session.toString() });
      session.write(`${PARTICIPANT_AI}: ${text}`);
      setSession(event.userId, session);
      event.sendText(text);
      return event;
    } catch (err) {
      event.sendText(err.message);
      return event;
    }
  }
  return event;
};

const handleEvents = async (events = []) => Promise.all(
  (await Promise.all(
    events
      .map((event) => new Event(event))
      .filter((event) => event.isEventTypeMessage)
      .filter((event) => event.isMessageTypeText)
      .map((event) => handleEvent(event)),
  ))
    .filter((event) => event.messages.length > 0)
    .map((event) => replyMessage(event)),
);

export default handleEvents;
