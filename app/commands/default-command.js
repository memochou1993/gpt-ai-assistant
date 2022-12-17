import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import generateCompletion from '../../utils/generate-completion.js';
import Event from '../models/event.js';
import { getSession, setSession } from '../sessions.js';

/**
 * @param {Event} event
 * @returns {Event}
 */
const defaultCommand = async (event) => {
  try {
    const session = getSession(event.userId);
    session.write(`${PARTICIPANT_HUMAN}: ${event.text}？`);
    const { text } = await generateCompletion({ prompt: session.toString() });
    session.write(`${PARTICIPANT_AI}: ${text}`);
    setSession(event.userId, session);
    event.sendText(text);
  } catch (err) {
    event.sendText(err.message);
  }
  return event;
};

export {
  defaultCommand,
};

export default null;
