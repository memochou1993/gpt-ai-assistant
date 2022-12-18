import { COMMAND_DEPLOY } from '../../constants/command.js';
import { deploy } from '../../services/vercel.js';
import Event from '../models/event.js';

const isDeployCommand = ({ input }) => input === COMMAND_DEPLOY;

/**
 * @param {Event} event
 * @returns {Event}
 */
const execDeployCommand = async (event) => {
  try {
    await deploy();
    event.sendText('deploying');
  } catch (err) {
    event
      .sendText(err.message)
      .sendText(err.response.data.error.message);
  }
  return event;
};

export {
  isDeployCommand,
  execDeployCommand,
};
