import { t } from '../languages/index.js';
import {
  COMMAND_ADVISE,
  COMMAND_BLAME,
  COMMAND_COMFORT,
  COMMAND_LAUGH,
  COMMAND_SUMMARIZE,
} from './command.js';

const enquiries = {};
enquiries[COMMAND_ADVISE.text] = t('__COMPLETION_PROMPT_ADVISE');
enquiries[COMMAND_BLAME.text] = t('__COMPLETION_PROMPT_BLAME');
enquiries[COMMAND_COMFORT.text] = t('__COMPLETION_PROMPT_COMFORT');
enquiries[COMMAND_LAUGH.text] = t('__COMPLETION_PROMPT_LAUGH');
enquiries[COMMAND_SUMMARIZE.text] = t('__COMPLETION_PROMPT_SUMMARIZE');

export {
  enquiries,
};

export default null;
