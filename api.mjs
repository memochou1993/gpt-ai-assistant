import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

export const TITLE_AI = 'AI';
export const TITLE_HUMAN = 'Human';
export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const prompt = (context) => openai.createCompletion({
  model: 'text-davinci-003',
  prompt: context,
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: [
    ` ${TITLE_AI}:`,
    ` ${TITLE_HUMAN}:`,
  ],
});

export const chat = async ({ context, reply = '' }) => {
  const { data } = await prompt(context);
  const [choice] = data.choices;
  const text = choice.text.trim('\n');
  context += text;
  reply += text;
  const res = { context, reply };
  return choice.finish_reason === FINISH_REASON_STOP ? res : chat(res);
};
