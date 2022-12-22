import { COMMAND_DEACTIVATE } from '../../constants/command.js';
import { SETTING_BOT_ACTIVATED } from '../../constants/setting.js';
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
  await storage.setItem(SETTING_BOT_ACTIVATED, false);
  event.sendText(COMMAND_DEACTIVATE.reply);
  return event;
};

export {
  isDeactivateCommand,
  execDeactivateCommand,
};
