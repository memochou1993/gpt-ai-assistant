import { createImage } from '../services/openai.js';

class Image {
  constructor({ url }) {
    this.url = url;
  }
}

/**
 * @param {Object} param
 * @param {string} param.prompt
 * @returns {Promise<Image>}
 */
const generateImage = async ({
  prompt,
}) => {
  const { data } = await createImage({ prompt });
  const [image] = data.data;
  return new Image(image);
};

export default generateImage;
