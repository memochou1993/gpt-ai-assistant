import { COMMAND_CONTINUE } from '../../constants/command.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isContinue = (context) => context.isCommand(COMMAND_CONTINUE);

export {
  isContinue,
};

export default null;
