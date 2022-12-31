import MessageAction from '../app/actions/message.js';
import { t } from '../locales/index.js';
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

const enquiryActions = [
  new MessageAction(COMMAND_ADVISE),
  new MessageAction(COMMAND_ANALYZE),
  new MessageAction(COMMAND_BLAME),
  new MessageAction(COMMAND_COMFORT),
  new MessageAction(COMMAND_COMPLAIN),
  new MessageAction(COMMAND_LAUGH),
  new MessageAction(COMMAND_MISLEAD),
  new MessageAction(COMMAND_SUMMARIZE),
];

export {
  enquiries,
  enquiryActions,
};
