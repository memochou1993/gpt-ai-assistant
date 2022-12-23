import { COMMAND_DRAW } from '../../constants/command.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import generateImage from '../../utils/generate-image.js';
import Event from '../event.js';
import { getSession, setSession } from '../sessions.js';

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
  const session = getSession(event.userId);
  session
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${event.text}？`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const { url } = await generateImage({ prompt: event.text });
    setSession(event.userId, session.write('OK'));
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
