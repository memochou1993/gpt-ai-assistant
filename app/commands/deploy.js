import { COMMAND_DEPLOY } from '../../constants/command.js';
import { redeploy } from '../../utils/index.js';
import Context from '../context.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const isDeployCommand = (context) => context.isCommand(COMMAND_DEPLOY);

/**
 * @param {Context} context
 * @returns {Context}
 */
const execDeployCommand = async (context) => {
  try {
    await redeploy();
    context.pushText(COMMAND_DEPLOY.reply);
  } catch (err) {
    context.pushText(err.message);
    if (err.response) context.pushText(err.response.data.error.message);
  }
  return context;
};

export {
  isDeployCommand,
  execDeployCommand,
};
