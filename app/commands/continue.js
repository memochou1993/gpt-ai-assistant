import { COMMAND_CONTINUE } from '../../constants/command.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isContinueCommand = (context) => context.isCommand(COMMAND_CONTINUE);

export {
  isContinueCommand,
};

export default null;
