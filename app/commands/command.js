import config from '../../config/index.js';
import {
  COMMAND_ACTIVATE,
  COMMAND_CALL_DEMO,
  COMMAND_COMMAND,
  COMMAND_DEACTIVATE,
  COMMAND_DEPLOY,
  COMMAND_DOC,
  COMMAND_DRAW_DEMO,
  COMMAND_SUMMARIZE,
  COMMAND_TALK_DEMO,
  COMMAND_VERSION,
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
    const actions = [
      new MessageAction(COMMAND_CALL_DEMO),
      new MessageAction(COMMAND_TALK_DEMO),
      new MessageAction(COMMAND_DRAW_DEMO),
      new MessageAction(COMMAND_SUMMARIZE),
      new MessageAction(COMMAND_DEPLOY),
    ];
    context.pushTemplate(config.SETTING_AI_NAME, buttons, actions);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isCommand,
  execCommandCommand,
};
