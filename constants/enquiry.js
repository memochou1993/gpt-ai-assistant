import MessageAction from '../app/actions/message.js';
import {
  COMMAND_ACT_ADVISE,
  COMMAND_ACT_APOLOGIZE,
  COMMAND_ACT_BLAME,
  COMMAND_ACT_COMFORT,
  COMMAND_ACT_COMPLAIN,
  COMMAND_ACT_LAUGH,
  COMMAND_ACT_SUM,
  COMMAND_ANALYZE,
  COMMAND_ANALYZE_LITERARILY,
  COMMAND_ANALYZE_MATHEMATICALLY,
  COMMAND_ANALYZE_NUMEROLOGICALLY,
  COMMAND_ANALYZE_PHILOSOPHICALLY,
} from './command.js';

export const actCommands = [
  COMMAND_ACT_ADVISE,
  COMMAND_ACT_APOLOGIZE,
  COMMAND_ACT_BLAME,
  COMMAND_ACT_COMFORT,
  COMMAND_ACT_COMPLAIN,
  COMMAND_ACT_LAUGH,
  COMMAND_ACT_SUM,
];

export const analyzeCommands = [
  COMMAND_ANALYZE,
  COMMAND_ANALYZE_LITERARILY,
  COMMAND_ANALYZE_MATHEMATICALLY,
  COMMAND_ANALYZE_NUMEROLOGICALLY,
  COMMAND_ANALYZE_PHILOSOPHICALLY,
];

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
  let actions = [];
  if (isActing) actions = actions.concat(actActions);
  if (isAnalyzing) actions = actions.concat(analyzeActions);
  return actions;
};

export {
  getActions,
};
