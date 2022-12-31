import { COMMAND_VERSION } from '../../constants/command.js';
import { getVersion } from '../../utils/index.js';
import Context from '../context.js';
import { updateHistory } from '../histories.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isVersionCommand = (context) => context.isCommand(COMMAND_VERSION);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execVersionCommand = async (context) => {
  updateHistory(context.contextId, (history) => history.records.pop());
  const version = getVersion();
  context.pushText(version);
  return context;
};

export {
  isVersionCommand,
  execVersionCommand,
};
