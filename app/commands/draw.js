import { COMMAND_IMAGE } from '../../constants/command.js';
import generateImage from '../../utils/generate-image.js';
import Event from '../models/event.js';

const isDrawCommand = ({ input }) => input.startsWith(COMMAND_IMAGE);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execDrawCommand = async (event) => {
  try {
    const { url } = await generateImage({ prompt: event.text });
    event.sendImage(url);
  } catch (err) {
    event
      .sendText(err.message)
      .sendText(err.response.data.error.message);
  }
  return event;
};

export {
  isDrawCommand,
  execDrawCommand,
};
