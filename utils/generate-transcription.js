import { createAudioTranscriptions } from '../services/openai.js';

class Transcription {
  text;

  constructor({
    text,
  }) {
    this.text = text;
  }
}

/**
 * @param {Object} param
 * @param {Buffer} param.buffer
 * @param {string} param.file
 * @returns {Promise<Image>}
 */
const generateTranscription = async ({
  buffer,
  file,
}) => {
  const { data } = await createAudioTranscriptions({ buffer, file });
  return new Transcription(data);
};

export default generateTranscription;
