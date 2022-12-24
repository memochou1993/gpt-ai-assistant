import { COMMAND_CHAT, COMMAND_CONTINUE } from '../../constants/command.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import generateCompletion from '../../utils/generate-completion.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { getPrompt, setPrompt } from '../prompts.js';
import { isContinue } from './continue.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isChatCommand = (context) => context.hasCommand(COMMAND_CHAT);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execChatCommand = async (context) => {
  const prompt = getPrompt(context.userId);
  if (!isContinue(context)) {
    prompt
      .write(`\n${PARTICIPANT_HUMAN}: `)
      .write(`${context.argument}？`)
      .write(`\n${PARTICIPANT_AI}: `);
  }
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    setPrompt(context.userId, prompt.write(text));
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_CONTINUE)];
    context.pushText(text, actions);
  } catch (err) {
    context.pushText(err.message);
    if (err.response) context.pushText(err.response.data.error.message);
  }
  return context;
};

export {
  isChatCommand,
  execChatCommand,
};
