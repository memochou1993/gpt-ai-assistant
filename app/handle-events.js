import { SETTING_BOT_ACTIVATED } from '../constants/setting.js';
import storage from '../storage/index.js';
import { replyMessage } from '../utils/index.js';
import {
  execActivateCommand,
  execChatCommand,
  execDeactivateCommand,
  execDeployCommand,
  execDrawCommand,
  execSettingsCommand,
  execVersionCommand,
  isActivateCommand,
  isChatCommand,
  isDeactivateCommand,
  isDeployCommand,
  isDrawCommand,
  isSettings,
  isVersionCommand,
} from './commands/index.js';
import Event from './event.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const handleEvent = async (event) => (
  (isSettings(event) && execSettingsCommand(event))
    || (isVersionCommand(event) && execVersionCommand(event))
    || (isDeployCommand(event) && execDeployCommand(event))
    || (isDrawCommand(event) && execDrawCommand(event))
    || (isActivateCommand(event) && execActivateCommand(event))
    || (isDeactivateCommand(event) && execDeactivateCommand(event))
    || (isChatCommand(event) && execChatCommand(event))
    || ((await storage.getItem(SETTING_BOT_ACTIVATED) && execChatCommand(event)))
    || event
);

const handleEvents = async (events = []) => (
  Promise.all(
    (await Promise.all(
      events
        .map((event) => handleEvent(new Event(event))),
    ))
      .filter((event) => event.messages.length > 0)
      .map((event) => replyMessage(event)),
  )
);

export default handleEvents;
