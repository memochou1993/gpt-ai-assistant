import config from '../../config/index.js';
import { COMMAND_DEACTIVATE } from '../../constants/command.js';
import { FIELD_SOURCES } from '../repository/index.js';
import { t } from '../../locales/index.js';
import storage from '../../storage/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDeactivateCommand = (context) => context.isCommand(COMMAND_DEACTIVATE);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execDeactivateCommand = async (context) => {
  updateHistory(context.id, (history) => history.records.pop());
  if (!config.VERCEL_ACCESS_TOKEN) context.pushText(t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'));
  try {
    // FIXME: use repository
    const sources = storage.getItem(FIELD_SOURCES);
    context.source.bot.isActivated = false;
    sources[context.id] = context.source;
    await storage.setItem(FIELD_SOURCES, sources);
    context.pushText(COMMAND_DEACTIVATE.reply);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isDeactivateCommand,
  execDeactivateCommand,
};
