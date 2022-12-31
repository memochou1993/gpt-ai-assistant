import config from '../../config/index.js';
import { COMMAND_DEPLOY } from '../../constants/command.js';
import { t } from '../../languages/index.js';
import { deploy } from '../../services/vercel.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDeployCommand = (context) => context.isCommand(COMMAND_DEPLOY);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const execDeployCommand = async (context) => {
  updateHistory(context.contextId, (history) => history.records.pop());
  if (!config.VERCEL_DEPLOY_HOOK_URL) context.pushText(t('__ERROR_MISSING_ENV')('VERCEL_DEPLOY_HOOK_URL'));
  try {
    await deploy();
    context.pushText(COMMAND_DEPLOY.reply);
  } catch (err) {
    context.pushError(err);
  }
  return context;
};

export {
  isDeployCommand,
  execDeployCommand,
};
