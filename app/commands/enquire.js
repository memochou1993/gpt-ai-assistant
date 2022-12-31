import {
  COMMAND_ADVISE,
  COMMAND_ANALYZE,
  COMMAND_BLAME,
  COMMAND_COMFORT,
  COMMAND_COMPLAIN,
  COMMAND_CONTINUE,
  COMMAND_LAUGH,
  COMMAND_MISLEAD,
  COMMAND_SUMMARIZE,
} from '../../constants/command.js';
import { enquiryActions } from '../../constants/enquiry.js';
import { t } from '../../locales/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion, parseEnquiry } from '../../utils/index.js';
import MessageAction from '../actions/message.js';
import Context from '../context.js';
import { getHistory, updateHistory } from '../history/index.js';
import { getPrompt, SENTENCE_ENQUIRING, setPrompt } from '../prompt/index.js';
import { isTalkCommand } from './talk.js';

const hasCommand = (context) => (command) => context.isCommand(command) || (isTalkCommand(context) && context.hasCommand(command));

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isEnquireCommand = (context) => (
  hasCommand(context)(COMMAND_ADVISE)
  || hasCommand(context)(COMMAND_ANALYZE)
  || hasCommand(context)(COMMAND_BLAME)
  || hasCommand(context)(COMMAND_COMFORT)
  || hasCommand(context)(COMMAND_COMPLAIN)
  || hasCommand(context)(COMMAND_LAUGH)
  || hasCommand(context)(COMMAND_MISLEAD)
  || hasCommand(context)(COMMAND_SUMMARIZE)
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execEnquireCommand = async (context) => {
  updateHistory(context.contextId, (history) => history.records.pop());
  const enquiry = parseEnquiry(context.event.trimmedText);
  const history = getHistory(context.contextId);
  if (history.records.length < 1) return context;
  const content = `${enquiry}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}\n${history.toString()}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`;
  const prompt = getPrompt(context.userId);
  prompt.write(PARTICIPANT_HUMAN, content).write(PARTICIPANT_AI);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    prompt.patch(text);
    if (!isFinishReasonStop) prompt.write('', SENTENCE_ENQUIRING);
    setPrompt(context.userId, prompt);
    const actions = isFinishReasonStop ? enquiryActions : [new MessageAction(COMMAND_CONTINUE)];
    context.pushText(text, actions);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isEnquireCommand,
  execEnquireCommand,
};
