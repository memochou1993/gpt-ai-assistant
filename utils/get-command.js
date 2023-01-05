import * as commands from '../constants/command.js';

/**
 * @param {string} text
 * @returns {Object}
 */
const getCommand = (text) => Object.values(commands).sort((a, b) => b.text.length - a.text.length).find((c) => text.toLowerCase().includes(c.text.toLowerCase()));

export default getCommand;
