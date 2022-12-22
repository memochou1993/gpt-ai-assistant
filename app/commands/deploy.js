import { COMMAND_DEPLOY } from '../../constants/command.js';
import { deploy } from '../../services/vercel.js';
import Event from '../event.js';

/**
 * @param {Event} event
 * @returns {boolean}
 */
const isDeployCommand = (event) => event.isCommand(COMMAND_DEPLOY);

/**
 * @param {Event} event
 * @returns {Event}
 */
const execDeployCommand = async (event) => {
  try {
    await deploy();
    event.sendText(COMMAND_DEPLOY.reply);
  } catch (err) {
    event.sendText(err.message);
    if (err.response) event.sendText(err.response.data.error.message);
  }
  return event;
};

export {
  isDeployCommand,
  execDeployCommand,
};
