import {
  COMMAND_ACTIVATE, COMMAND_DEACTIVATE, COMMAND_DEPLOY, COMMAND_SETTINGS, COMMAND_VERSION,
} from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import storage from '../../storage/index.js';
import { MessageAction } from '../actions/index.js';
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
  event.sendTemplate(COMMAND_SETTINGS.label, [
    new MessageAction(COMMAND_VERSION),
    new MessageAction(await storage.getItem(SETTING_AI_ACTIVATED) ? COMMAND_DEACTIVATE : COMMAND_ACTIVATE),
    new MessageAction(COMMAND_DEPLOY),
  ]);
  return event;
};

export {
  isSettings,
  execSettingsCommand,
};
