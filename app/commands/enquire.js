import { ACT_COMMANDS, ANALYZE_COMMANDS, COMMAND_SYS_CONTINUE } from '../../constants/command.js';
import { SENTENCE_ACTING, SENTENCE_ANALYZING } from '../../constants/prompt.js';
import { t } from '../../locales/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion, getActions, getCommand } from '../../utils/index.js';
import MessageAction from '../actions/message.js';
import Context from '../context.js';
import { getHistory, updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';
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
const isActCommand = (context) => ACT_COMMANDS
  .sort((a, b) => b.text.length - a.text.length)
  .some((command) => hasCommand(context)(command));

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isAnalyzeCommand = (context) => ANALYZE_COMMANDS
  .sort((a, b) => b.text.length - a.text.length)
  .some((command) => hasCommand(context)(command));

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isEnquireCommand = (context) => (
  isActCommand(context) || isAnalyzeCommand(context)
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execEnquireCommand = async (context) => {
  updateHistory(context.id, (history) => history.records.pop());
  const command = getCommand(context.trimmedText);
  const history = getHistory(context.id);
  const content = `${command.prompt}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}\n${history.toString()}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`;
  const prompt = getPrompt(context.userId);
  prompt.write(PARTICIPANT_HUMAN, content).write(PARTICIPANT_AI);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: content });
    prompt.patch(text);
    if (!isFinishReasonStop) {
      if (isActCommand(context)) prompt.write('', SENTENCE_ACTING);
      if (isAnalyzeCommand(context)) prompt.write('', SENTENCE_ANALYZING);
    }
    setPrompt(context.userId, prompt);
    const enquiryActions = getActions({ isActing: isActCommand(context), isAnalyzing: isAnalyzeCommand(context) });
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
