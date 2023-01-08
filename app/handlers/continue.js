import { COMMAND_SYS_CONTINUE } from '../../app/commands/index.js';
import { generateCompletion, getActions } from '../../utils/index.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.isCommand(COMMAND_SYS_CONTINUE);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    updateHistory(context.id, (history) => history.records.pop());
    const prompt = getPrompt(context.userId);
    const { lastSentence } = prompt;
    if (lastSentence.isEnquiring) prompt.sentences.pop();
    try {
      const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
      if (!text) return context;
      prompt.patch(text);
      if (!lastSentence.isEnquiring) {
        updateHistory(context.id, (history) => history.patch(text));
      }
      setPrompt(context.userId, prompt);
      const defaultActions = getActions(lastSentence);
      const actions = isFinishReasonStop ? defaultActions : [new MessageAction(COMMAND_SYS_CONTINUE)];
      context.pushText(text, actions);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
