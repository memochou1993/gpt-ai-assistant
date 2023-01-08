import { TYPE_SYSTEM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './Command.js';

export default new Command({
  type: TYPE_SYSTEM,
  label: t('__COMMAND_SYS_DOC_LABEL'),
  text: t('__COMMAND_SYS_DOC_TEXT'),
  prompt: t('__COMMAND_SYS_DOC_PROMPT'),
  aliases: [
    '/doc',
    'Doc',
  ],
});
