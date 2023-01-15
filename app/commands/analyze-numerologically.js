import { TYPE_ANALYZE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_ANALYZE,
  label: t('__COMMAND_ANALYZE_NUMEROLOGICALLY_LABEL'),
  text: t('__COMMAND_ANALYZE_NUMEROLOGICALLY_TEXT'),
  prompt: t('__COMMAND_ANALYZE_NUMEROLOGICALLY_PROMPT'),
  aliases: [
    '/analyze-numerologically',
    'Analyze numerologically',
  ],
});
