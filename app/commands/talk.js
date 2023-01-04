import config from '../../config/index.js';
import { COMMAND_SYS_CONTINUE, COMMAND_SYS_TALK } from '../../constants/command.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion } from '../../utils/index.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isActivated = (context) => context.source.bot.isActivated;

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isTalkCommand = (context) => context.hasCommand(COMMAND_SYS_TALK) || isActivated(context);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execTalkCommand = async (context) => {
  const prompt = getPrompt(context.userId);
  prompt.write(PARTICIPANT_HUMAN, `${context.trimmedText}？`).write(PARTICIPANT_AI);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    prompt.patch(text);
    setPrompt(context.userId, prompt);
    updateHistory(context.id, (history) => history.write(config.BOT_NAME, text));
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_SYS_CONTINUE)];
    context.pushText(text, actions);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isTalkCommand,
  execTalkCommand,
};
