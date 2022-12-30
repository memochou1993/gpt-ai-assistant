import config from '../../config/index.js';
import { COMMAND_DRAW } from '../../constants/command.js';
import { TEXT_OK } from '../../constants/mock.js';
import { writeRecord } from '../records.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateImage } from '../../utils/index.js';
import Context from '../context.js';
import { getPrompt, setPrompt } from '../prompts.js';

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
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${input}？`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const { url } = await generateImage({ prompt: context.argument, size });
    prompt.write(TEXT_OK);
    setPrompt(context.userId, prompt);
    writeRecord(context.contextId, config.SETTING_AI_NAME, TEXT_OK);
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
