import {
  createCompletion,
  FINISH_REASON_STOP,
  PARTICIPANT_AI,
} from '../services/openai/index.js';

const completePrompt = async ({
  prompt,
  text = '',
}) => {
  const { data } = await createCompletion({ prompt });
  const [choice] = data.choices;
  prompt += choice.text.trim();
  text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
  const res = { prompt, text };
  return choice.finish_reason === FINISH_REASON_STOP ? res : completePrompt(res);
};

export default completePrompt;
