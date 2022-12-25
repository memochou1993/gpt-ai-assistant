import { COMMAND_CONTINUE } from '../../constants/command.js';
import Context from '../context.js';
import { execChatCommand } from './chat.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isContinueCommand = (context) => context.isCommand(COMMAND_CONTINUE);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execContinueCommand = (context) => execChatCommand(context);

export {
  isContinueCommand,
  execContinueCommand,
};

export default null;
