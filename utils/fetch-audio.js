import { fetchContent } from '../services/line.js';

/**
 * @param {string} messageId
 * @returns {Promise<Buffer>}
 */
const fetchAudio = async (messageId) => {
  const { data } = await fetchContent({ messageId });
  return Buffer.from(data, 'binary');
};

export default fetchAudio;
