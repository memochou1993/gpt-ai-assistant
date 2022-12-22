import {
  COMMAND_DISABLE_AUTO_REPLY, COMMAND_ENABLE_AUTO_REPLY, COMMAND_SETTINGS, COMMAND_VERSION,
} from '../../constants/command.js';
import { PostbackAction } from '../actions/index.js';
import Event from '../event.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isSettings = (event) => event.isCommand(COMMAND_SETTINGS);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execSettingsCommand = async (event) => {
  event.sendTemplate('Settings', [
    new PostbackAction(COMMAND_VERSION),
    new PostbackAction(COMMAND_DISABLE_AUTO_REPLY),
    new PostbackAction(COMMAND_ENABLE_AUTO_REPLY),
  ]);
  return event;
};

export {
  isSettings,
  execSettingsCommand,
};
