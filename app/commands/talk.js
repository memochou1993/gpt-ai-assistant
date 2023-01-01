import config from '../../config/index.js';
import { COMMAND_CONTINUE, COMMAND_TALK } from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import { generateCompletion } from '../../utils/index.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @returns {boolean}
 */
const isActivated = () => storage.getItem(SETTING_AI_ACTIVATED) !== String(false);

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isTalkCommand = (context) => context.hasCommand(COMMAND_TALK) || isActivated();

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execTalkCommand = async (context) => {
  const prompt = getPrompt(context.userId);
  prompt.write(PARTICIPANT_HUMAN, `${context.trimmedText}？`).write(PARTICIPANT_AI, '');
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    prompt.patch(text);
    setPrompt(context.userId, prompt);
    updateHistory(context.contextId, (history) => history.write(config.BOT_AI_NAME, text));
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_CONTINUE)];
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
