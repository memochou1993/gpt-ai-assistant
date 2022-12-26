import {
  COMMAND_ACTIVATE, COMMAND_COMMAND, COMMAND_DEACTIVATE, COMMAND_DOC, COMMAND_VERSION,
} from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import { t } from '../../languages/index.js';
import storage from '../../storage/index.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isCommand = (context) => context.isCommand(COMMAND_COMMAND);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execCommandCommand = async (context) => {
  try {
    const buttons = [
      new MessageAction(COMMAND_VERSION),
      new MessageAction(COMMAND_DOC),
      new MessageAction((await storage.getItem(SETTING_AI_ACTIVATED)) === String(false) ? COMMAND_ACTIVATE : COMMAND_DEACTIVATE),
      new MessageAction(COMMAND_COMMAND),
    ];
    context.pushTemplate(t('__TEMPLATE_TITLE_COMMAND'), buttons);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isCommand,
  execCommandCommand,
};
