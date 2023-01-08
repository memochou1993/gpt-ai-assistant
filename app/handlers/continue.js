import { generateCompletion } from '../../utils/index.js';
import { ALL_COMMANDS, COMMAND_SYS_CONTINUE } from '../commands/index.js';
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
      const defaultActions = ALL_COMMANDS.filter(({ type }) => type === lastSentence.text);
      const actions = isFinishReasonStop ? defaultActions : [COMMAND_SYS_CONTINUE];
      context.pushText(text, actions);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
