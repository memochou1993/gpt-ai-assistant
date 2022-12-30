import { COMMAND_SUMMARIZE } from '../../constants/command.js';
import { t } from '../../languages/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion } from '../../utils/index.js';
import Context from '../context.js';
import { getPrompt } from '../prompts.js';
import { getFormattedHistory } from '../histories.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isSummarizeCommand = (context) => context.isCommand(COMMAND_SUMMARIZE);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execSummarizeCommand = async (context) => {
  const content = getFormattedHistory(context.contextId);
  const prompt = getPrompt(context.userId);
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${t('__COMPLETION_SUMMARIZE_REQUEST')}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}${content}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const { text } = await generateCompletion({ prompt: prompt.toString() });
    context.pushText(text);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isSummarizeCommand,
  execSummarizeCommand,
};
