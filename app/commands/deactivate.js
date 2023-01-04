import config from '../../config/index.js';
import { COMMAND_SYS_DEACTIVATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { updateSources } from '../repository/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDeactivateCommand = (context) => context.isCommand(COMMAND_SYS_DEACTIVATE);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execDeactivateCommand = async (context) => {
  updateHistory(context.id, (history) => history.records.pop());
  if (!config.VERCEL_ACCESS_TOKEN) context.pushText(t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'));
  try {
    await updateSources(context.id, (source) => {
      source.bot.isActivated = false;
    });
    context.pushText(COMMAND_SYS_DEACTIVATE.reply);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isDeactivateCommand,
  execDeactivateCommand,
};
