import { TYPE_SUM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_SUM,
  label: t('__COMMAND_SUM_COMFORT_LABEL'),
  text: t('__COMMAND_SUM_COMFORT_TEXT'),
  prompt: t('__COMMAND_SUM_COMFORT_PROMPT'),
  aliases: [
    '/comfort',
    'Comfort',
  ],
});
