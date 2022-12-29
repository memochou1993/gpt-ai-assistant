import { COMMAND_CONTINUE } from '../../constants/command.js';
import { generateCompletion } from '../../utils/index.js';
import MessageAction from '../actions/message.js';
import Context from '../context.js';
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
  const prompt = getPrompt(context.userId);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    if (!text) return context;
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
  isContinueCommand,
  execContinueCommand,
};

export default null;
