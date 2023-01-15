import { TYPE_ANALYZE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_ANALYZE,
  label: t('__COMMAND_ANALYZE_PHILOSOPHICALLY_LABEL'),
  text: t('__COMMAND_ANALYZE_PHILOSOPHICALLY_TEXT'),
  prompt: t('__COMMAND_ANALYZE_PHILOSOPHICALLY_PROMPT'),
  aliases: [
    '/analyze-philosophically',
    'Analyze philosophically',
  ],
});
