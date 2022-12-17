import fs from 'fs';

/**
 * @returns {string}
 */
const getVersion = () => JSON.parse(fs.readFileSync('package.json')).version;

export default getVersion;
