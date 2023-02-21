import { COMMAND_BOT_FORGET } from '../commands/index.js';
import Context from '../context.js';
import { removeHistory } from '../history/index.js';
import { removePrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_BOT_FORGET);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    removePrompt(context.userId);
    removeHistory(context.userId);
    context.pushText(COMMAND_BOT_FORGET.reply);
    return context;
  }
)();

export default exec;
