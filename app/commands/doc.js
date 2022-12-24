import { COMMAND_DOC } from '../../constants/command.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDocCommand = (context) => context.isCommand(COMMAND_DOC);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execDocCommand = async (context) => {
  context.pushText('https://github.com/memochou1993/gpt-ai-assistant');
  return context;
};

export {
  isDocCommand,
  execDocCommand,
};
