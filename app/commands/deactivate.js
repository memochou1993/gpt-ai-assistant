import { COMMAND_DEACTIVATE } from '../../constants/command.js';
import { SETTING_CHAT_AUTO_REPLY } from '../../constants/setting.js';
import storage from '../../storage/index.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isDeactivateCommand = (event) => event.isCommand(COMMAND_DEACTIVATE);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execDeactivateCommand = async (event) => {
  await storage.setItem(SETTING_CHAT_AUTO_REPLY, false);
  event.sendText(COMMAND_DEACTIVATE.reply);
  return event;
};

export {
  isDeactivateCommand,
  execDeactivateCommand,
};
