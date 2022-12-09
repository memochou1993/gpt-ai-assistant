import {
  TITLE_AI,
  FINISH_REASON_STOP,
  prompt,
} from '../services/openai.mjs';

export const messages = [
  `${TITLE_AI}: 嗨！我可以怎麼幫助你？`,
];

export const chat = async ({ context, reply = '' }) => {
  const { data } = await prompt(context);
  const [choice] = data.choices;
  const text = choice.text.trim();
  context += text;
  reply += text.replace(TITLE_AI, '').replace(':', '').replace('：', '').trim();
  const res = { context, reply };
  return choice.finish_reason === FINISH_REASON_STOP ? res : chat(res);
};

export default null;
