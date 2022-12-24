import config from '../../config/index.js';
import { COMMAND_DRAW } from '../../constants/command.js';
import { SETTING_IMAGE_GENERATION_SIZE } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import generateImage from '../../utils/generate-image.js';
import Context from '../context.js';
import { getPrompt, setPrompt } from '../prompts.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDrawCommand = (context) => context.hasCommand(COMMAND_DRAW);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execDrawCommand = async (context) => {
  const prompt = getPrompt(context.userId);
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${context.argument}？`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const size = config.APP_STORAGE[SETTING_IMAGE_GENERATION_SIZE];
    const { url } = await generateImage({ prompt: context.argument, size });
    setPrompt(context.userId, prompt.write('OK!'));
    context.pushImage(url);
  } catch (err) {
    if (typeof err.response.data === 'string') {
      return context.pushText(`Request failed with status code ${err.response.status}`);
    }
    context.pushText(err.message);
    if (err.response) context.pushText(err.response.data.error.message);
  }
  return context;
};

export {
  isDrawCommand,
  execDrawCommand,
};
