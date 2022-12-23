import { COMMAND_CHAT, COMMAND_CONTINUE } from '../../constants/command.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import generateCompletion from '../../utils/generate-completion.js';
import { MessageAction } from '../actions/index.js';
import Event from '../event.js';
import { getSession, setSession } from '../sessions.js';
import { isContinue } from './continue.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isChatCommand = (event) => event.hasCommand(COMMAND_CHAT);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execChatCommand = async (event) => {
  const session = getSession(event.userId);
  if (!isContinue(event)) {
    session
      .write(`\n${PARTICIPANT_HUMAN}: `)
      .write(`${event.text}？`)
      .write(`\n${PARTICIPANT_AI}: `);
  }
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: session.toString() });
    setSession(event.userId, session.write(text));
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_CONTINUE)];
    event.sendText(text, actions);
  } catch (err) {
    event.sendText(err.message);
    if (err.response) event.sendText(err.response.data.error.message);
  }
  return event;
};

export {
  isChatCommand,
  execChatCommand,
};
