import { replyMessage } from '../utils/index.js';
import {
  activateCommand,
  commandCommand,
  continueCommand,
  deactivateCommand,
  deployCommand,
  docCommand,
  drawCommand,
  enquireCommand,
  reportCommand,
  talkCommand,
  versionCommand,
} from './commands/index.js';
import Context from './context.js';
import Event from './event.js';

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const handleContext = async (context) => (
  activateCommand(context)
  || commandCommand(context)
  || continueCommand(context)
  || deactivateCommand(context)
  || deployCommand(context)
  || docCommand(context)
  || drawCommand(context)
  || enquireCommand(context)
  || reportCommand(context)
  || versionCommand(context)
  || talkCommand(context)
  || context
);

const handleEvents = async (events = []) => (
  (Promise.all(
    (await Promise.all(
      (await Promise.all(
        events
          .map((event) => new Event(event))
          .filter((event) => event.isMessage)
          .map((event) => new Context(event))
          .map((context) => context.initialize()),
      ))
        .map((context) => (!context.error ? handleContext(context) : context)),
    ))
      .filter((context) => context.messages.length > 0)
      .map((context) => replyMessage(context)),
  ))
);

export default handleEvents;
