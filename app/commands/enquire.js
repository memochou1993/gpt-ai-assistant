import {
  COMMAND_ANALYZE,
  COMMAND_ANALYZE_MATHEMATICALLY,
  COMMAND_ANALYZE_NUMEROLOGICALLY,
  COMMAND_ANALYZE_PHILOSOPHICALLY,
  COMMAND_ACT_ADVISE,
  COMMAND_ACT_APOLOGIZE,
  COMMAND_ACT_BLAME,
  COMMAND_ACT_COMFORT,
  COMMAND_ACT_COMPLAIN,
  COMMAND_ACT_LAUGH,
  COMMAND_ACT_SUM,
  COMMAND_SYS_CONTINUE,
} from '../../constants/command.js';
import { enquiryActions } from '../../constants/enquiry.js';
import { t } from '../../locales/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion, parseEnquiry } from '../../utils/index.js';
import MessageAction from '../actions/message.js';
import Context from '../context.js';
import { getHistory, updateHistory } from '../history/index.js';
import { getPrompt, SENTENCE_ENQUIRING, setPrompt } from '../prompt/index.js';
import { isSummonCommand } from './summon.js';

/**
 * @param {Context} context
 * @returns {function(string): boolean}
 */
const hasCommand = (context) => (command) => context.isCommand(command) || (isSummonCommand(context) && context.hasCommand(command));

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isEnquireCommand = (context) => (
  hasCommand(context)(COMMAND_ACT_ADVISE)
  || hasCommand(context)(COMMAND_ACT_APOLOGIZE)
  || hasCommand(context)(COMMAND_ACT_BLAME)
  || hasCommand(context)(COMMAND_ACT_COMFORT)
  || hasCommand(context)(COMMAND_ACT_COMPLAIN)
  || hasCommand(context)(COMMAND_ACT_LAUGH)
  || hasCommand(context)(COMMAND_ACT_SUM)
  || hasCommand(context)(COMMAND_ANALYZE_MATHEMATICALLY)
  || hasCommand(context)(COMMAND_ANALYZE_NUMEROLOGICALLY)
  || hasCommand(context)(COMMAND_ANALYZE_PHILOSOPHICALLY)
  || hasCommand(context)(COMMAND_ANALYZE)
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execEnquireCommand = async (context) => {
  updateHistory(context.id, (history) => history.records.pop());
  const enquiry = parseEnquiry(context.trimmedText);
  const history = getHistory(context.id);
  if (history.records.length < 1) return context;
  const content = `${enquiry}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}\n${history.toString()}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`;
  const prompt = getPrompt(context.userId);
  prompt.write(PARTICIPANT_HUMAN, content).write(PARTICIPANT_AI);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: content });
    prompt.patch(text);
    if (!isFinishReasonStop) prompt.write('', SENTENCE_ENQUIRING);
    setPrompt(context.userId, prompt);
    const actions = isFinishReasonStop ? enquiryActions : [new MessageAction(COMMAND_SYS_CONTINUE)];
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
