import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_TRANSLATE,
  label: t('__COMMAND_TRANSLATE_TO_JA_LABEL'),
  text: t('__COMMAND_TRANSLATE_TO_JA_TEXT'),
  prompt: t('__COMMAND_TRANSLATE_TO_JA_PROMPT'),
  aliases: [
    '/translate-to-ja',
    'Translate to Japanese',
    'Translate to JA',
  ],
});
