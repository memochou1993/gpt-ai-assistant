import { replyMessage } from '../utils/index.js';
import {
  execActivateCommand,
  execAdviseCommand,
  execCallCommand,
  execCommandCommand,
  execConfigureCommand,
  execContinueCommand,
  execDeactivateCommand,
  execDeployCommand,
  execDocCommand,
  execDrawCommand,
  execSummarizeCommand,
  execTalkCommand,
  execVersionCommand,
  isActivateCommand,
  isAdviseCommand,
  isCallCommand,
  isCommand,
  isConfigureCommand,
  isContinueCommand,
  isDeactivateCommand,
  isDeployCommand,
  isDocCommand,
  isDrawCommand,
  isSummarizeCommand,
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
    || (isAdviseCommand(context) && execAdviseCommand(context))
    || (isCommand(context) && execCommandCommand(context))
    || (isConfigureCommand(context) && execConfigureCommand(context))
    || (isContinueCommand(context) && execContinueCommand(context))
    || (isDeactivateCommand(context) && execDeactivateCommand(context))
    || (isDeployCommand(context) && execDeployCommand(context))
    || (isDocCommand(context) && execDocCommand(context))
    || (isDrawCommand(context) && execDrawCommand(context))
    || (isSummarizeCommand(context) && execSummarizeCommand(context))
    || (isVersionCommand(context) && execVersionCommand(context))
    || (await isCallCommand(context) && execCallCommand(context))
    || (await isTalkCommand(context) && execTalkCommand(context))
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
