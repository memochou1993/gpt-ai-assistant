import config from '../config/index.js';
import { createCompletion, FINISH_REASON_STOP, PARTICIPANT_AI } from '../services/openai.js';

class Completion {
  constructor({ prompt, text }) {
    this.prompt = prompt;
    this.text = text;
  }
}

/**
 * @param {Object} param
 * @param {string} param.prompt
 * @param {string} param.text
 * @returns {Promise<Completion>}
 */
const generateCompletion = async ({
  prompt,
  text = '',
}) => {
  const completion = new Completion({ prompt, text });
  if (config.APP_ENV !== 'production') return completion;
  const { data } = await createCompletion({ prompt });
  const [choice] = data.choices;
  completion.prompt += choice.text.trim();
  completion.text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
  return choice.finish_reason === FINISH_REASON_STOP ? completion : generateCompletion(completion);
};

export default generateCompletion;
