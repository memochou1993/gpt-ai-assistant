import { ALL_COMMANDS } from '../app/commands/index.js';

/**
 * @param {string} text
 * @returns {Object}
 */
const getCommand = (text) => Object.values(ALL_COMMANDS).sort((a, b) => b.text.length - a.text.length).find((c) => text.toLowerCase().includes(c.text.toLowerCase()));

export default getCommand;
