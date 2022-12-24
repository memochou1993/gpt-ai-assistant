import { COMMAND_CONFIGURE } from '../../constants/command.js';
import storage from '../../storage/index.js';
import Context from '../context.js';

const SEPARATOR = '=';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isConfigureCommand = (context) => context.hasCommand(COMMAND_CONFIGURE);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execConfigureCommand = async (context) => {
  const [command] = context.event.text.split(' ');
  if (command !== COMMAND_CONFIGURE.text && !COMMAND_CONFIGURE.aliases.some((alias) => alias === command)) return context;
  const [key, value] = context.argument.split(SEPARATOR);
  if (key && context.argument.includes(SEPARATOR)) {
    try {
      await storage.setItem(key, value);
      context.pushText(COMMAND_CONFIGURE.reply);
    } catch (err) {
      context.pushText(err.message);
      if (err.response) context.pushText(err.response.data.error.message);
    }
    return context;
  }
  try {
    const item = await storage.getItem(key);
    context.pushText(String(JSON.stringify(item)));
  } catch (err) {
    context.pushText(err.message);
    if (err.response) context.pushText(err.response.data.error.message);
  }
  return context;
};

export {
  isConfigureCommand,
  execConfigureCommand,
};
