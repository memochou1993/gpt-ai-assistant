import { t } from '../languages/index.js';
import {
  COMMAND_ADVISE,
  COMMAND_BLAME,
  COMMAND_SUMMARIZE,
} from './command.js';

const enquiries = {};
enquiries[COMMAND_ADVISE.text] = t('__COMPLETION_PROMPT_ADVISE');
enquiries[COMMAND_SUMMARIZE.text] = t('__COMPLETION_PROMPT_SUMMARIZE');
enquiries[COMMAND_BLAME.text] = t('__COMPLETION_PROMPT_BLAME');

export {
  enquiries,
};

export default null;
