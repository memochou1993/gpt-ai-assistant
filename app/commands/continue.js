import config from '../../config/index.js';
import { COMMAND_CONTINUE } from '../../constants/command.js';
import { enquiryActions } from '../../constants/enquiry.js';
import { generateCompletion } from '../../utils/index.js';
import MessageAction from '../actions/message.js';
import Context from '../context.js';
import { updateHistory } from '../histories.js';
import { getPrompt, setPrompt } from '../prompts.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isContinueCommand = (context) => context.isCommand(COMMAND_CONTINUE);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execContinueCommand = async (context) => {
  updateHistory(context.contextId, (history) => history.records.pop());
  const prompt = getPrompt(context.userId);
  const { lastSentence } = prompt;
  if (lastSentence.isEnquiring) prompt.sentences.pop();
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    if (!text) return context;
    prompt.patch(text);
    if (!lastSentence.isEnquiring) {
      updateHistory(context.contextId, (history) => history.write(config.SETTING_AI_NAME, text));
    }
    setPrompt(context.userId, prompt);
    const defaultActions = lastSentence.isEnquiring ? enquiryActions : [];
    const actions = isFinishReasonStop ? defaultActions : [new MessageAction(COMMAND_CONTINUE)];
    context.pushText(text, actions);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isContinueCommand,
  execContinueCommand,
};

export default null;
