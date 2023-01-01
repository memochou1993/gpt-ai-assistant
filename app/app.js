import { replyMessage } from '../utils/index.js';
import {
  execActivateCommand,
  execCommandCommand,
  execContinueCommand,
  execDeactivateCommand,
  execDeployCommand,
  execDocCommand,
  execDrawCommand,
  execEnquireCommand,
  execSummonCommand,
  execTalkCommand,
  execVersionCommand,
  isActivateCommand,
  isCommandCommand,
  isContinueCommand,
  isDeactivateCommand,
  isDeployCommand,
  isDocCommand,
  isDrawCommand,
  isEnquireCommand,
  isSummonCommand,
  isTalkCommand,
  isVersionCommand,
} from './commands/index.js';
import Context from './context.js';
import Event from './event.js';

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const handleContext = async (context) => (
  (isActivateCommand(context) && execActivateCommand(context))
    || (isCommandCommand(context) && execCommandCommand(context))
    || (isContinueCommand(context) && execContinueCommand(context))
    || (isDeactivateCommand(context) && execDeactivateCommand(context))
    || (isDeployCommand(context) && execDeployCommand(context))
    || (isDocCommand(context) && execDocCommand(context))
    || (isDrawCommand(context) && execDrawCommand(context))
    || (isEnquireCommand(context) && execEnquireCommand(context))
    || (isSummonCommand(context) && execSummonCommand(context))
    || (isVersionCommand(context) && execVersionCommand(context))
    || (isTalkCommand(context) && execTalkCommand(context))
    || context
);

const handleEvents = async (events = []) => (
  Promise.all(
    (await Promise.all(
      (await Promise.all(
        events
          .map((event) => new Event(event))
          .filter((event) => event.isMessage)
          .map((event) => new Context(event))
          .map((context) => context.initialize()),
      ))
        .map((context) => handleContext(context)),
    ))
      .filter((context) => context.messages.length > 0)
      .map((context) => replyMessage(context)),
  )
);

export default handleEvents;
