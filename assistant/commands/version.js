import {
  COMMAND_VERSION,
} from '../../constants/command';
import {
  getVersion,
} from '../../utils';
import BaseCommand from './base.js';

// TODO
// export const COMMAND_VERSION = 'version';

class VersionCommand extends BaseCommand {
  /**
   * @param {Event} event
   * @returns {Event}
   */
  handleEvent(event) {
    if (event.input === COMMAND_VERSION) {
      const text = getVersion();
      event.pushReply(text);
    }
    return event;
  }
}

export default VersionCommand;
