import fs from 'fs';

const getVersion = () => JSON.parse(fs.readFileSync('package.json')).version;

export default getVersion;
