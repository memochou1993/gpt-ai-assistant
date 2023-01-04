import MessageAction from '../app/actions/message.js';
import { t } from '../locales/index.js';
import {
  COMMAND_ANALYZE,
  COMMAND_ANALYZE_MATHEMATICALLY,
  COMMAND_ANALYZE_NUMEROLOGICALLY,
  COMMAND_ANALYZE_PHILOSOPHICALLY,
  COMMAND_ACT_ADVISE,
  COMMAND_ACT_APOLOGIZE,
  COMMAND_ACT_BLAME,
  COMMAND_ACT_COMFORT,
  COMMAND_ACT_COMPLAIN,
  COMMAND_ACT_LAUGH,
  COMMAND_ACT_SUM,
} from './command.js';

export const enquiries = {};
enquiries[COMMAND_ACT_ADVISE.text] = t('__COMPLETION_PROMPT_SUM_ADVISE');
enquiries[COMMAND_ACT_APOLOGIZE.text] = t('__COMPLETION_PROMPT_SUM_APOLOGIZE');
enquiries[COMMAND_ACT_BLAME.text] = t('__COMPLETION_PROMPT_SUM_BLAME');
enquiries[COMMAND_ACT_COMFORT.text] = t('__COMPLETION_PROMPT_SUM_COMFORT');
enquiries[COMMAND_ACT_COMPLAIN.text] = t('__COMPLETION_PROMPT_SUM_COMPLAIN');
enquiries[COMMAND_ACT_LAUGH.text] = t('__COMPLETION_PROMPT_SUM_LAUGH');
enquiries[COMMAND_ACT_SUM.text] = t('__COMPLETION_PROMPT_SUM');
enquiries[COMMAND_ANALYZE_MATHEMATICALLY.text] = t('__COMPLETION_PROMPT_ANALYZE_MATHEMATICALLY');
enquiries[COMMAND_ANALYZE_NUMEROLOGICALLY.text] = t('__COMPLETION_PROMPT_ANALYZE_NUMEROLOGICALLY');
enquiries[COMMAND_ANALYZE_PHILOSOPHICALLY.text] = t('__COMPLETION_PROMPT_ANALYZE_PHILOSOPHICALLY');
enquiries[COMMAND_ANALYZE.text] = t('__COMPLETION_PROMPT_ANALYZE');

const actActions = [
  new MessageAction(COMMAND_ACT_ADVISE),
  new MessageAction(COMMAND_ACT_APOLOGIZE),
  new MessageAction(COMMAND_ACT_BLAME),
  new MessageAction(COMMAND_ACT_COMFORT),
  new MessageAction(COMMAND_ACT_COMPLAIN),
  new MessageAction(COMMAND_ACT_LAUGH),
  new MessageAction(COMMAND_ACT_SUM),
];

const analyzeActions = [
  new MessageAction(COMMAND_ANALYZE),
  new MessageAction(COMMAND_ANALYZE_MATHEMATICALLY),
  new MessageAction(COMMAND_ANALYZE_NUMEROLOGICALLY),
  new MessageAction(COMMAND_ANALYZE_PHILOSOPHICALLY),
];

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
