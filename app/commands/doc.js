import { COMMAND_DOC } from '../../constants/command.js';
import Event from '../event.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isDocCommand = (event) => event.isCommand(COMMAND_DOC);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execDocCommand = async (event) => {
  event.sendText('https://github.com/memochou1993/gpt-ai-assistant');
  return event;
};

export {
  isDocCommand,
  execDocCommand,
};
