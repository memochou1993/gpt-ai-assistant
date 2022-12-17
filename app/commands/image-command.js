import { COMMAND_IMAGE } from '../../constants/command.js';
import generateImage from '../../utils/generate-image.js';
import Event from '../models/event.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const imageCommand = (event) => (
  event.input.startsWith(COMMAND_IMAGE) && (async () => {
    const { url } = await generateImage({ prompt: event.text });
    event.sendImage(url);
    return event;
  })()
);

export {
  imageCommand,
};

export default null;
