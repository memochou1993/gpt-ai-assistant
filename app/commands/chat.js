import {
  COMMAND_AI, COMMAND_CHAT, COMMAND_CONTINUE, COMMAND_DISABLE_AUTO_REPLY, COMMAND_ENABLE_AUTO_REPLY,
} from '../../constants/command.js';
import { SETTING_CHAT_AUTO_REPLY } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import generateCompletion from '../../utils/generate-completion.js';
import Event from '../event.js';
import { getSession, setSession } from '../sessions.js';
import { isContinue } from './continue.js';
import { MessageAction } from '../actions/index.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isChatCommand = (event) => event.isCommand(COMMAND_CHAT) || event.isCommand(COMMAND_AI);

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isDisableAutoReplyCommand = (event) => event.isCommand(COMMAND_DISABLE_AUTO_REPLY);

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isEnableAutoReplyCommand = (event) => event.isCommand(COMMAND_ENABLE_AUTO_REPLY);

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
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_CONTINUE)];
    event.sendText(text, actions);
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
// FIXME
const execChatAutoReplyOffCommand = async (event) => {
  await storage.setItem(SETTING_CHAT_AUTO_REPLY, false);
  event.sendText('off');
  return event;
};

/**
 * @param {Event} event
 * @returns {Event}
 */
// FIXME
const execChatAutoReplyOnCommand = async (event) => {
  await storage.setItem(SETTING_CHAT_AUTO_REPLY, true);
  event.sendText('on');
  return event;
};

export {
  isChatCommand,
  isDisableAutoReplyCommand,
  isEnableAutoReplyCommand,
  execChatCommand,
  execChatAutoReplyOffCommand,
  execChatAutoReplyOnCommand,
};
