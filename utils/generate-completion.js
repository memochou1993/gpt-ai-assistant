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
const generateComplete = async ({
  prompt,
  text = '',
}) => {
  const { data } = await createCompletion({ prompt });
  const [choice] = data.choices;
  prompt += choice.text.trim();
  text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
  const completion = new Completion({ prompt, text });
  return choice.finish_reason === FINISH_REASON_STOP ? completion : generateComplete(completion);
};

export default generateComplete;
