import { fetchContent } from '../services/line.js';

/**
 * @param {string} messageId
 * @returns {Promise<string>}
 */
const fetchImage = async (messageId) => {
  const { data } = await fetchContent({ messageId });
  return `data:image/jpeg;base64,${Buffer.from(data, 'binary').toString('base64')}`;
};

export default fetchImage;
