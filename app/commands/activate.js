import { COMMAND_ACTIVATE } from '../../constants/command.js';
import { SETTING_CHAT_AUTO_REPLY } from '../../constants/setting.js';
import storage from '../../storage/index.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isActivateCommand = (event) => event.isCommand(COMMAND_ACTIVATE);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execActivateCommand = async (event) => {
  await storage.setItem(SETTING_CHAT_AUTO_REPLY, true);
  event.sendText(COMMAND_ACTIVATE.reply);
  return event;
};

export {
  isActivateCommand,
  execActivateCommand,
};
