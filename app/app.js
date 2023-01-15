import { replyMessage } from '../utils/index.js';
import {
  activateHandler,
  commandHandler,
  continueHandler,
  deactivateHandler,
  deployHandler,
  docHandler,
  drawHandler,
  enquireHandler,
  reportHandler,
  talkHandler,
  versionHandler,
} from './handlers/index.js';
import Context from './context.js';
import Event from './event.js';

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const handleContext = async (context) => (
  activateHandler(context)
  || commandHandler(context)
  || continueHandler(context)
  || deactivateHandler(context)
  || deployHandler(context)
  || docHandler(context)
  || drawHandler(context)
  || enquireHandler(context)
  || reportHandler(context)
  || versionHandler(context)
  || talkHandler(context)
  || context
);

const handleEvents = async (events = []) => (
  (Promise.all(
    (await Promise.all(
      (await Promise.all(
        events
          .map((event) => new Event(event))
          .filter((event) => event.isMessage && event.isText)
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
