import { COMMAND_SYS_REPORT, GENERAL_COMMANDS } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import formatCommand from '../../utils/format-command.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.isCommand(COMMAND_SYS_REPORT);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    updateHistory(context.id, (history) => history.records.pop());
    context.pushText(COMMAND_SYS_REPORT.reply, formatCommand(GENERAL_COMMANDS));
    return context;
  }
)();

export default exec;
