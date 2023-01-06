import MessageAction from '../app/actions/message.js';
import { actCommands, analyzeCommands } from '../constants/command.js';

const actActions = actCommands.map((command) => new MessageAction(command));
const analyzeActions = analyzeCommands.map((command) => new MessageAction(command));

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
  if (isActing) return actActions;
  if (isAnalyzing) return analyzeActions;
  return [];
};

export default getActions;
