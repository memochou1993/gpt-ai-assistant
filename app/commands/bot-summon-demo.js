import config from '../../config/index.js';
import { TYPE_SYSTEM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_SYSTEM,
  label: t('__COMMAND_BOT_SUMMON_DEMO_LABEL'),
  text: `${config.BOT_NAME} ${t('__COMMAND_BOT_SUMMON_DEMO_TEXT')}`,
});
