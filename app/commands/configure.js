import { COMMAND_CONFIGURE } from '../../constants/command.js';
import storage from '../../storage/index.js';
import Event from '../event.js';

const SEPARATOR = '=';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isConfigureCommand = (event) => event.hasCommand(COMMAND_CONFIGURE);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execConfigureCommand = async (event) => {
  const [command] = event.message.text.split(' ');
  if (command !== COMMAND_CONFIGURE.text && !COMMAND_CONFIGURE.aliases.some((alias) => alias === command)) return event;
  const [key, value] = event.text.split(SEPARATOR);
  if (key && event.text.includes(SEPARATOR)) {
    try {
      await storage.setItem(key, value);
      event.sendText(COMMAND_CONFIGURE.reply);
    } catch (err) {
      event.sendText(err.message);
      if (err.response) event.sendText(err.response.data.error.message);
    }
    return event;
  }
  try {
    const item = await storage.getItem(key);
    if (item === undefined) return event;
    event.sendText(JSON.stringify(item));
  } catch (err) {
    event.sendText(err.message);
    if (err.response) event.sendText(err.response.data.error.message);
  }
  return event;
};

export {
  isConfigureCommand,
  execConfigureCommand,
};
