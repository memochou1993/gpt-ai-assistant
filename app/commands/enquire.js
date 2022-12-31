import {
  COMMAND_ADVISE,
  COMMAND_BLAME,
  COMMAND_CONTINUE,
  COMMAND_LAUGH,
  COMMAND_SUMMARIZE,
} from '../../constants/command.js';
import { t } from '../../languages/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion, parseEnquiry } from '../../utils/index.js';
import MessageAction from '../actions/message.js';
import Context from '../context.js';
import { getFormattedHistory, updateHistory } from '../histories.js';
import { getPrompt, setPrompt } from '../prompts.js';
import { isTalkCommand } from './talk.js';

const hasCommand = (context) => (command) => context.isCommand(command) || (isTalkCommand(context) && context.hasCommand(command));

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isEnquireCommand = (context) => (
  hasCommand(context)(COMMAND_ADVISE)
  || hasCommand(context)(COMMAND_BLAME)
  || hasCommand(context)(COMMAND_LAUGH)
  || hasCommand(context)(COMMAND_SUMMARIZE)
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execEnquireCommand = async (context) => {
  updateHistory(context.contextId, (history) => history.records.pop());
  const enquiry = parseEnquiry(context.event.trimmedText);
  const content = getFormattedHistory(context.contextId);
  const prompt = getPrompt(context.userId);
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${enquiry}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}\n${content}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    prompt.write(text);
    setPrompt(context.userId, prompt);
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_CONTINUE)];
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
