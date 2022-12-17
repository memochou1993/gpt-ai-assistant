import { COMMAND_VERSION } from '../../constants/command.js';
import { getVersion } from '../../utils/index.js';
import Event from '../models/event.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const versionCommand = (event) => (
  event.input === COMMAND_VERSION && (async () => {
    const version = getVersion();
    event.sendText(version);
    return event;
  })()
);

export {
  versionCommand,
};

export default null;
