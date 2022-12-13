import {
  PARTICIPANT_AI,
  FINISH_REASON_STOP,
  createCompletion,
} from '../services/openai.js';

const complete = async ({
  prompt,
  text = '',
}) => {
  const { data } = await createCompletion({ prompt });
  const [choice] = data.choices;
  prompt += choice.text.trim();
  text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
  const res = { prompt, text };
  return choice.finish_reason === FINISH_REASON_STOP ? res : complete(res);
};

export default complete;
