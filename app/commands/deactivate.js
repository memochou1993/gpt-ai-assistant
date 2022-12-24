import { COMMAND_DEACTIVATE } from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import storage from '../../storage/index.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDeactivateCommand = (context) => context.isCommand(COMMAND_DEACTIVATE);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execDeactivateCommand = async (context) => {
  await storage.setItem(SETTING_AI_ACTIVATED, false);
  context.pushText(COMMAND_DEACTIVATE.reply);
  return context;
};

export {
  isDeactivateCommand,
  execDeactivateCommand,
};
