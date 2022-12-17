import { COMMAND_AI, COMMAND_AI_AUTO_REPLY_OFF, COMMAND_AI_AUTO_REPLY_ON } from '../../constants/command.js';
import { SETTING_AI_AUTO_REPLY } from '../../constants/setting.js';
import storage from '../../storage/index.js';
import Event from '../models/event.js';
import { defaultCommand } from './default-command.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const aiCommand = (event) => (
  event.input.startsWith(COMMAND_AI) && defaultCommand(event)
);

/**
 * @param {Event} event
 * @returns {Event}
 */
const aiAutoReplyOffCommand = (event) => (
  event.input === COMMAND_AI_AUTO_REPLY_OFF && (async () => {
    await storage.setItem(SETTING_AI_AUTO_REPLY, false);
    event.sendText('off');
    return event;
  })()
);

/**
 * @param {Event} event
 * @returns {Event}
 */
const aiAutoReplyOnCommand = (event) => (
  event.input === COMMAND_AI_AUTO_REPLY_ON && (async () => {
    await storage.setItem(SETTING_AI_AUTO_REPLY, true);
    event.sendText('on');
    return event;
  })()
);

export {
  aiCommand,
  aiAutoReplyOffCommand,
  aiAutoReplyOnCommand,
};
