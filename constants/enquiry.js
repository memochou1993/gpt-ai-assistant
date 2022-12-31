import { t } from '../languages/index.js';
import {
  COMMAND_ADVISE,
  COMMAND_ANALYZE,
  COMMAND_BLAME,
  COMMAND_COMFORT,
  COMMAND_COMPLAIN,
  COMMAND_LAUGH,
  COMMAND_MISLEAD,
  COMMAND_SUMMARIZE,
} from './command.js';

const enquiries = {};
enquiries[COMMAND_ADVISE.text] = t('__COMPLETION_PROMPT_ADVISE');
enquiries[COMMAND_ANALYZE.text] = t('__COMPLETION_PROMPT_ANALYZE');
enquiries[COMMAND_BLAME.text] = t('__COMPLETION_PROMPT_BLAME');
enquiries[COMMAND_COMFORT.text] = t('__COMPLETION_PROMPT_COMFORT');
enquiries[COMMAND_COMPLAIN.text] = t('__COMPLETION_PROMPT_COMPLAIN');
enquiries[COMMAND_LAUGH.text] = t('__COMPLETION_PROMPT_LAUGH');
enquiries[COMMAND_MISLEAD.text] = t('__COMPLETION_PROMPT_MISLEAD');
enquiries[COMMAND_SUMMARIZE.text] = t('__COMPLETION_PROMPT_SUMMARIZE');

export {
  enquiries,
};

export default null;
