import { COMMAND_VERSION } from '../../constants/command.js';
import { getVersion } from '../../utils/index.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isVersionCommand = (context) => context.isCommand(COMMAND_VERSION);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execVersionCommand = async (context) => {
  const version = getVersion();
  context.pushText(version);
  return context;
};

export {
  isVersionCommand,
  execVersionCommand,
};
