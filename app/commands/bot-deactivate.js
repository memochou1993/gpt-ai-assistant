import { TYPE_SYSTEM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './Command.js';

export default new Command({
  type: TYPE_SYSTEM,
  label: t('__COMMAND_BOT_DEACTIVATE_LABEL'),
  text: t('__COMMAND_BOT_DEACTIVATE_TEXT'),
  reply: t('__COMMAND_BOT_DEACTIVATE_REPLY'),
  aliases: [
    '/deactivate',
    'Deactivate',
  ],
});
