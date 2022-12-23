import { COMMAND_CONFIGURE } from '../../constants/command.js';
import storage from '../../storage/index.js';
import Event from '../event.js';

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
  const [key, value] = event.text.split('=');
  if (!key || !value) return event;
  try {
    await storage.setItem(key, value);
    event.sendText(COMMAND_CONFIGURE.reply);
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
