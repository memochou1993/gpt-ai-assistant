import { SETTING_AI_ACTIVATED } from '../../constants/setting.js';
import storage from '../../storage/index.js';
import Context from '../context.js';
import { execChatCommand } from './chat.js';

/**
 * @returns {Promise<boolean>}
 */
const isCalled = () => {
  const a = storage.getItem(SETTING_AI_ACTIVATED, true);
  console.log(11, a);
  return true;
};

/**
 * @param {Context} context
 * @returns {Context}
 */
const execCallCommand = async (context) => {
  await execChatCommand(context);
  return context;
};

export {
  isCalled,
  execCallCommand,
};
