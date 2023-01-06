import MessageAction from '../app/actions/message.js';
import { ACT_COMMANDS, ANALYZE_COMMANDS } from '../constants/command.js';
import formatCommand from './format-command.js';

/**
 * @param {Object} param
 * @param {boolean} param.isActing
 * @param {boolean} param.isAnalyzing
 * @returns {Array<MessageAction>}
 */
const getActions = ({
  isActing,
  isAnalyzing,
}) => {
  if (isActing) return formatCommand(ACT_COMMANDS);
  if (isAnalyzing) return formatCommand(ANALYZE_COMMANDS);
  return [];
};

export default getActions;
