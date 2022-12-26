import { COMMAND_DEPLOY } from '../../constants/command.js';
import { deploy } from '../../services/vercel.js';
import Context from '../context.js';

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
