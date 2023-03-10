import { COMMAND_SYS_REPORT, GENERAL_COMMANDS } from '../commands/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_SYS_REPORT);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    updateHistory(context.id, (history) => history.erase());
    context.pushText('https://github.com/memochou1993/gpt-ai-assistant/issues', GENERAL_COMMANDS);
    return context;
  }
)();

export default exec;
