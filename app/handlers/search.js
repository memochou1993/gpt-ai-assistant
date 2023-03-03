import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { ROLE_AI, ROLE_HUMAN } from '../../services/openai.js';
import { fetchAnswer, generateCompletion } from '../../utils/index.js';
import { COMMAND_BOT_CONTINUE, COMMAND_BOT_SEARCH } from '../commands/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_BOT_SEARCH);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    let trimmedText = context.trimmedText.replace(COMMAND_BOT_SEARCH.text, '');
    const prompt = getPrompt(context.userId);
    if (!config.SERPAPI_API_KEY) context.pushText(t('__ERROR_MISSING_ENV')('SERPAPI_API_KEY'));
    try {
      const { answer } = await fetchAnswer(`${trimmedText}？`);
      trimmedText = `${t('__COMPLETION_SEARCH')(answer || t('__COMPLETION_SEARCH_NOT_FOUND'), trimmedText)}`;
    } catch (err) {
      return context.pushError(err);
    }
    prompt.write(ROLE_HUMAN, `${trimmedText}。`).write(ROLE_AI);
    try {
      const { text, isFinishReasonStop } = await generateCompletion({ prompt });
      prompt.patch(text);
      setPrompt(context.userId, prompt);
      updateHistory(context.id, (history) => history.write(config.BOT_NAME, text));
      const actions = isFinishReasonStop ? [] : [COMMAND_BOT_CONTINUE];
      context.pushText(text, actions);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
