import { COMMAND_ACTIVATE } from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import storage from '../../storage/index.js';
import Event from '../event.js';

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
  await storage.setItem(SETTING_AI_ACTIVATED, true);
  event.sendText(COMMAND_ACTIVATE.reply);
  return event;
};

export {
  isActivateCommand,
  execActivateCommand,
};
