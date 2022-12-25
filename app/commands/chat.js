import { COMMAND_CHAT, COMMAND_CONTINUE } from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import generateCompletion from '../../utils/generate-completion.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { getPrompt, setPrompt } from '../prompts.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isContinue = (context) => context.isCommand(COMMAND_CONTINUE);

/**
 * @returns {Promise<boolean>}
 */
const isActivated = async () => (await storage.getItem(SETTING_AI_ACTIVATED)) !== 'false';

/**
 * @param {Context} context
 * @returns {Promise<boolean>}
 */
const isChatCommand = (context) => context.hasCommand(COMMAND_CHAT) || isActivated();

/**
 * @param {Context} context
 * @returns {Promise<Context>}
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
    prompt.write(text);
    setPrompt(context.userId, prompt);
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
