import config from '../../config/index.js';
import Context from '../context.js';
import { execTalkCommand } from './talk.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isCallCommand = (context) => {
  if (!context.event.isText) return false;
  const name = config.SETTING_AI_NAME;
  const input = context.event.text.replaceAll('　', ' ').trim().toLowerCase();
  return input.startsWith(name.toLowerCase());
};

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execCallCommand = (context) => execTalkCommand(context);

export {
  isCallCommand,
  execCallCommand,
};
