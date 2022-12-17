import { SETTING_AI_AUTO_REPLY } from '../constants/setting.js';
import storage from '../storage/index.js';
import { replyMessage } from '../utils/index.js';
import {
  aiAutoReplyOffCommand,
  aiAutoReplyOnCommand,
  aiCommand,
  defaultCommand,
  deployCommand,
  imageCommand,
  versionCommand,
} from './commands/index.js';
import Event from './models/event.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const handleEvent = async (event) => (
  versionCommand(event)
    || deployCommand(event)
    || imageCommand(event)
    || aiAutoReplyOffCommand(event)
    || aiAutoReplyOnCommand(event)
    || aiCommand(event)
    || ((await storage.getItem(SETTING_AI_AUTO_REPLY) && defaultCommand(event)))
    || event
);

const handleEvents = async (events = []) => Promise.all(
  (await Promise.all(
    events
      .map((event) => new Event(event))
      .filter((event) => event.isEventTypeMessage)
      .filter((event) => event.isMessageTypeText)
      .map((event) => handleEvent(event)),
  ))
    .filter((event) => event.messages.length > 0)
    .map((event) => replyMessage(event)),
);

export default handleEvents;
