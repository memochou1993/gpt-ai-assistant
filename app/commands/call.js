import { SETTING_AI_NAME } from '../../constants/setting.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import storage from '../../storage/index.js';
import Context from '../context.js';
import { getPrompt, setPrompt } from '../prompts.js';
import { execChatCommand } from './chat.js';

/**
 * @param {Context} context
 * @returns {Promise<boolean>}
 */
const isCallCommand = async (context) => {
  const name = await storage.getItem(SETTING_AI_NAME, { useConfig: true });
  if (!name) return false;
  return context.event.text.startsWith(name);
};

/**
 * @param {Context} context
 * @returns {Context}
 */
const execCallCommand = (context) => {
  const prompt = getPrompt(context.userId);
  prompt
    .write(`\n${PARTICIPANT_HUMAN}: `)
    .write(`你叫${context.argument}。`)
    .write(`\n${PARTICIPANT_AI}: `)
    .write(`我叫${context.argument}。`);
  setPrompt(context.userId, prompt);
  return execChatCommand(context);
};

export {
  isCallCommand,
  execCallCommand,
};
