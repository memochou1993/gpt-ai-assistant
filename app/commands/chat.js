import {
  ARG_AUTO_REPLY_OFF, ARG_AUTO_REPLY_ON, COMMAND_AI, COMMAND_CHAT, COMMAND_CONTINUE,
} from '../../constants/command.js';
import { SETTING_CHAT_AUTO_REPLY } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import createAction from '../../utils/create-action.js';
import generateCompletion from '../../utils/generate-completion.js';
import Event from '../event.js';
import { getSession, setSession } from '../sessions.js';
import { isContinue } from './continue.js';

const isChatCommand = (event) => event.isCommand(COMMAND_CHAT) || event.isCommand(COMMAND_AI);
const isChatAutoReplyOffCommand = (event) => isChatCommand(event) && event.hasArgument(ARG_AUTO_REPLY_OFF);
const isChatAutoReplyOnCommand = (event) => isChatCommand(event) && event.hasArgument(ARG_AUTO_REPLY_ON);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execChatCommand = async (event) => {
  try {
    const session = getSession(event.userId);
    if (!isContinue(event)) {
      session.write(`\n${PARTICIPANT_HUMAN}: `);
      session.write(`${event.text}？`);
      session.write(`\n${PARTICIPANT_AI}: `);
    }
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: session.toString() });
    if (!text) return event;
    session.write(text);
    setSession(event.userId, session);
    event.sendText(text, isFinishReasonStop ? [] : [createAction(COMMAND_CONTINUE)]);
  } catch (err) {
    event.sendText(err.message);
    if (err.response) event.sendText(err.response.data.error.message);
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
