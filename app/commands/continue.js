import { COMMAND_CONTINUE } from '../../constants/command.js';
import Event from '../event.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isContinue = (event) => event.isCommand(COMMAND_CONTINUE);

export {
  isContinue,
};

export default null;
