import { MessageAction } from '../app/actions/index.js';
import { ACT_COMMANDS, ANALYZE_COMMANDS, TRANSLATE_COMMANDS } from '../constants/command.js';

/**
 * @param {string} label
 * @returns {Array<MessageAction>}
 */
const getActions = (label) => {
  if (ACT_COMMANDS.some((c) => c.label === label)) return ACT_COMMANDS;
  if (ANALYZE_COMMANDS.some((c) => c.label === label)) return ANALYZE_COMMANDS;
  if (TRANSLATE_COMMANDS.some((c) => c.label === label)) return TRANSLATE_COMMANDS;
  return [];
};

export default getActions;
