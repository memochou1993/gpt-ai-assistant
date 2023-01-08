import { MessageAction } from '../app/actions/index.js';
import { Command } from '../app/commands/index.js';

/**
 *
 * @param {Array<Command>} commands
 * @returns {Array<MessageAction>}
 */
const formatCommands = (commands) => commands.map((command) => new MessageAction(command));

export default formatCommands;
