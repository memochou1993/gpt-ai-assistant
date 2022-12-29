import { COMMAND_CHAT, COMMAND_CONTINUE } from '../../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import { fetchDisplayName, generateCompletion } from '../../utils/index.js';
import { MessageAction } from '../actions/index.js';
import Context from '../context.js';
import { getPrompt, setPrompt } from '../prompts.js';

/**
 * @param {Context} context
 * @returns {Promise<boolean>}
 */
const isActivated = async (context) => {
  try {
    return (await storage.getItem(SETTING_AI_ACTIVATED)) !== String(false);
  } catch (err) {
    context.pushError(err);
    return false;
  }
};

/**
 * @param {Context} context
 * @returns {Promise<boolean>}
 */
const isChatCommand = (context) => context.hasCommand(COMMAND_CHAT) || isActivated(context);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execChatCommand = async (context) => {
  const input = context.event.trimmedText;
  const prompt = getPrompt(context.userId);
  if (!prompt.displayName) prompt.setDisplayName(await fetchDisplayName(context.userId));
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`${input}？`)
    .write(`\n${PARTICIPANT_AI}: `);
  try {
    const { text, isFinishReasonStop } = await generateCompletion({ prompt: prompt.toString() });
    prompt.write(text);
    setPrompt(context.userId, prompt);
    const actions = isFinishReasonStop ? [] : [new MessageAction(COMMAND_CONTINUE)];
    context.pushText(text, actions);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isChatCommand,
  execChatCommand,
};
