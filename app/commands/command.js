import {
  COMMAND_ACTIVATE, COMMAND_COMMAND, COMMAND_DEACTIVATE, COMMAND_DEPLOY, COMMAND_DOC, COMMAND_VERSION,
} from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import storage from '../../storage/index.js';
import { MessageAction } from '../actions/index.js';
import Event from '../event.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isCommand = (event) => event.isCommand(COMMAND_COMMAND);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execCommandCommand = async (event) => {
  const buttons = [
    new MessageAction(COMMAND_DOC),
    new MessageAction(COMMAND_VERSION),
    new MessageAction(COMMAND_COMMAND),
  ];
  const actions = [
    new MessageAction(await storage.getItem(SETTING_AI_ACTIVATED) ? COMMAND_DEACTIVATE : COMMAND_ACTIVATE),
    new MessageAction(COMMAND_DEPLOY),
  ];
  event.sendTemplate(COMMAND_COMMAND.label, buttons, actions);
  return event;
};

export {
  isCommand,
  execCommandCommand,
};
