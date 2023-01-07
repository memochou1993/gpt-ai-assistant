import { COMMAND_SYS_VERSION, GENERAL_COMMANDS } from '../../constants/command.js';
import { formatCommand, getVersion } from '../../utils/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.isCommand(COMMAND_SYS_VERSION);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    updateHistory(context.id, (history) => history.records.pop());
    const version = getVersion();
    context.pushText(version, formatCommand(GENERAL_COMMANDS));
    return context;
  }
)();

export default exec;
