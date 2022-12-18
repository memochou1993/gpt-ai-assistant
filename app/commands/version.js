import { COMMAND_VERSION } from '../../constants/command.js';
import { getVersion } from '../../utils/index.js';
import Event from '../models/event.js';

const isVersionCommand = (event) => event.isCommand(COMMAND_VERSION);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execVersionCommand = async (event) => {
  const version = getVersion();
  event.sendText(version);
  return event;
};

export {
  isVersionCommand,
  execVersionCommand,
};
