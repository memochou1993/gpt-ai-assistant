import { TYPE_SUM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_SUM,
  label: t('__COMMAND_SUM_SUM_LABEL'),
  text: t('__COMMAND_SUM_SUM_TEXT'),
  prompt: t('__COMMAND_SUM_SUM_PROMPT'),
  aliases: [
    '/sum',
    'Sum',
  ],
});
