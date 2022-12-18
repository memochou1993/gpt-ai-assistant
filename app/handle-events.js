import { SETTING_AI_AUTO_REPLY } from '../constants/setting.js';
import storage from '../storage/index.js';
import { replyMessage } from '../utils/index.js';
import {
  execChatAutoReplyOffCommand,
  execChatAutoReplyOnCommand,
  execChatCommand,
  execDeployCommand,
  execDrawCommand,
  execVersionCommand,
  isChatAutoReplyOffCommand,
  isChatAutoReplyOnCommand,
  isChatCommand,
  isDeployCommand,
  isDrawCommand,
  isVersionCommand,
} from './commands/index.js';
import Event from './models/event.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const handleEvent = async (event) => (
  (isVersionCommand(event) && execVersionCommand(event))
    || (isDeployCommand(event) && execDeployCommand(event))
    || (isDrawCommand(event) && execDrawCommand(event))
    || (isChatAutoReplyOffCommand(event) && execChatAutoReplyOffCommand(event))
    || (isChatAutoReplyOnCommand(event) && execChatAutoReplyOnCommand(event))
    || (isChatCommand(event) && execChatCommand(event))
    || ((await storage.getItem(SETTING_AI_AUTO_REPLY) && execChatCommand(event)))
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
