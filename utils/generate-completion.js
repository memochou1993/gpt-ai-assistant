import config from '../config/index.js';
import { createCompletion, FINISH_REASON_STOP } from '../services/openai.js';

class Completion {
  text;

  finishReason;

  constructor({
    text,
    finishReason,
  }) {
    this.text = text;
    this.finishReason = finishReason;
  }

  get isFinishReasonStop() {
    return this.finishReason === FINISH_REASON_STOP;
  }
}

/**
 * @param {Object} param
 * @param {string} param.prompt
 * @returns {Promise<Completion>}
 */
const generateCompletion = async ({
  prompt,
}) => {
  if (config.APP_ENV !== 'production') return new Completion({ text: 'OK' });
  const { data } = await createCompletion({ prompt });
  const [choice] = data.choices;
  return new Completion({
    text: choice.text.trim(),
    finishReason: choice.finish_reason,
  });
};

export default generateCompletion;
