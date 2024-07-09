import config from '../../config/index.js';
import { MOCK_TEXT_OK } from '../../constants/mock.js';
import { ROLE_AI, ROLE_HUMAN } from '../../services/openai.js';
import { generateImage } from '../../utils/index.js';
import { COMMAND_BOT_DRAW } from '../commands/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_BOT_DRAW);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    const prompt = getPrompt(context.userId);
    prompt.write(ROLE_HUMAN, `${context.trimmedText}`).write(ROLE_AI);
    try {
      const trimmedText = context.trimmedText.replace(COMMAND_BOT_DRAW.text, '');
      const { url } = await generateImage({ prompt: trimmedText });
      prompt.patch(MOCK_TEXT_OK);
      setPrompt(context.userId, prompt);
      updateHistory(context.id, (history) => history.write(config.BOT_NAME, MOCK_TEXT_OK));
      context.pushImage(url);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
