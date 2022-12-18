import { COMMAND_CHAT, COMMAND_CHAT_AUTO_REPLY_OFF, COMMAND_CHAT_AUTO_REPLY_ON } from '../../constants/command.js';
import { SETTING_CHAT_AUTO_REPLY } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import generateCompletion from '../../utils/generate-completion.js';
import Event from '../models/event.js';
import { getSession, setSession } from '../sessions.js';

const isChatCommand = ({ input }) => input.toLowerCase().startsWith(COMMAND_CHAT);
const isChatAutoReplyOffCommand = ({ input }) => input.toLowerCase() === COMMAND_CHAT_AUTO_REPLY_OFF;
const isChatAutoReplyOnCommand = ({ input }) => input.toLowerCase() === COMMAND_CHAT_AUTO_REPLY_ON;

/**
 * @param {Event} event
 * @returns {Event}
 */
const execChatCommand = async (event) => {
  try {
    const session = getSession(event.userId);
    session.write(`${PARTICIPANT_HUMAN}: ${event.text}？`);
    const { text } = await generateCompletion({ prompt: session.toString() });
    session.write(`${PARTICIPANT_AI}: ${text}`);
    setSession(event.userId, session);
    event.sendText(text);
  } catch (err) {
    event
      .sendText(err.message)
      .sendText(err.response.data.error.message);
  }
  return event;
};

/**
 * @param {Event} event
 * @returns {Event}
 */
const execChatAutoReplyOffCommand = async (event) => {
  await storage.setItem(SETTING_CHAT_AUTO_REPLY, false);
  event.sendText('off');
  return event;
};

/**
 * @param {Event} event
 * @returns {Event}
 */
const execChatAutoReplyOnCommand = async (event) => {
  await storage.setItem(SETTING_CHAT_AUTO_REPLY, true);
  event.sendText('on');
  return event;
};

export {
  isChatCommand,
  isChatAutoReplyOffCommand,
  isChatAutoReplyOnCommand,
  execChatCommand,
  execChatAutoReplyOffCommand,
  execChatAutoReplyOnCommand,
};
