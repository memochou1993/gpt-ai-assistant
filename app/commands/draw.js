import config from '../../config/index.js';
import { COMMAND_DRAW } from '../../constants/command.js';
import { MOCK_TEXT_OK } from '../../constants/mock.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateImage } from '../../utils/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDrawCommand = (context) => context.hasCommand(COMMAND_DRAW);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execDrawCommand = async (context) => {
  const size = config.OPENAI_IMAGE_GENERATION_SIZE;
  const input = context.event.trimmedText;
  const prompt = getPrompt(context.userId);
  prompt.write(PARTICIPANT_HUMAN, `${input}？`).write(PARTICIPANT_AI);
  try {
    const { url } = await generateImage({ prompt: context.argument, size });
    prompt.patch(MOCK_TEXT_OK);
    setPrompt(context.userId, prompt);
    updateHistory(context.contextId, (history) => history.write(config.BOT_AI_NAME, MOCK_TEXT_OK));
    context.pushImage(url);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isDrawCommand,
  execDrawCommand,
};
