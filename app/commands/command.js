import config from '../../config/index.js';
import {
  COMMAND_ACT_SUM,
  COMMAND_ANALYZE,
  COMMAND_SYS_ACTIVATE,
  COMMAND_SYS_COMMAND,
  COMMAND_SYS_DEACTIVATE,
  COMMAND_SYS_DEPLOY,
  COMMAND_SYS_DOC,
  COMMAND_SYS_DRAW_DEMO,
  COMMAND_SYS_SUMMON_DEMO,
  COMMAND_SYS_TALK_DEMO,
  COMMAND_SYS_VERSION,
} from '../../constants/command.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isCommandCommand = (context) => context.isCommand(COMMAND_SYS_COMMAND);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execCommandCommand = async (context) => {
  updateHistory(context.id, (history) => history.records.pop());
  try {
    const buttons = [
      new MessageAction(COMMAND_SYS_VERSION),
      new MessageAction(COMMAND_SYS_DOC),
      new MessageAction(COMMAND_SYS_COMMAND),
      new MessageAction(context.source.bot.isActivated ? COMMAND_SYS_DEACTIVATE : COMMAND_SYS_ACTIVATE),
    ];
    const actions = [
      new MessageAction(COMMAND_SYS_SUMMON_DEMO),
      new MessageAction(COMMAND_SYS_TALK_DEMO),
      new MessageAction(COMMAND_SYS_DRAW_DEMO),
      new MessageAction(COMMAND_ACT_SUM),
      new MessageAction(COMMAND_ANALYZE),
      new MessageAction(COMMAND_SYS_DEPLOY),
    ];
    context.pushTemplate(config.BOT_NAME, buttons, actions);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isCommandCommand,
  execCommandCommand,
};
