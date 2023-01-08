import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './Command.js';

export default new Command({
  type: TYPE_TRANSLATE,
  label: t('__COMMAND_TRANSLATE_TO_EN_LABEL'),
  text: t('__COMMAND_TRANSLATE_TO_EN_TEXT'),
  prompt: t('__COMMAND_TRANSLATE_TO_EN_PROMPT'),
  aliases: [
    '/translate',
    'Translate',
  ],
});
