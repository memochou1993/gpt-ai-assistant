import { COMMAND_DRAW } from '../../constants/command.js';
import { SETTING_IMAGE_GENERATION_SIZE } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import generateImage from '../../utils/generate-image.js';
import Event from '../event.js';
import { getPrompt, setPrompt } from '../prompts.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isDrawCommand = (event) => event.hasCommand(COMMAND_DRAW);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execDrawCommand = async (event) => {
  const prompt = getPrompt(event.userId);
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${event.text}？`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const size = await storage.getItem(SETTING_IMAGE_GENERATION_SIZE);
    const { url } = await generateImage({ prompt: event.text, size });
    setPrompt(event.userId, prompt.write('OK!'));
    event.sendImage(url);
  } catch (err) {
    event.sendText(err.message);
    if (err.response) event.sendText(err.response.data.error.message);
  }
  return event;
};

export {
  isDrawCommand,
  execDrawCommand,
};
