import config from '../config/index.js';
import { createImage } from '../services/openai.js';

class Image {
  url;

  constructor({
    url,
  }) {
    this.url = url;
  }
}

/**
 * @param {Object} param
 * @param {string} param.prompt
 * @param {string} param.size
 * @returns {Promise<Image>}
 */
const generateImage = async ({
  prompt,
  size,
}) => {
  if (config.APP_ENV !== 'production') return new Image({ url: 'OK!' });
  const { data } = await createImage({ prompt, size });
  const [image] = data.data;
  return new Image(image);
};

export default generateImage;
