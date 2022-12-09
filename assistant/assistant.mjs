import {
  APP_ENV,
} from '../config/index.mjs';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
  FINISH_REASON_STOP,
  complete,
} from '../services/openai.mjs';
import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
  reply,
} from '../services/line.mjs';
import Prompt from './prompt.mjs';

class Assistant {
  prompt = new Prompt();

  constructor(text) {
    this.prompt.push(PARTICIPANT_AI, text);
  }

  handle(events = []) {
    return Promise.all(events.map((event) => this.process(event)));
  }

  async process({ type, replyToken, message }) {
    if (type !== EVENT_TYPE_MESSAGE) return null;
    this.prompt.push(PARTICIPANT_HUMAN, `${message.text}？`);
    const { text } = await this.chat({ prompt: this.prompt.toString() });
    this.prompt.push(PARTICIPANT_AI, text);
    const messages = [{ type: MESSAGE_TYPE_TEXT, text }];
    const res = { replyToken, messages };
    return APP_ENV === 'local' ? res : reply(res);
  }

  async chat({ prompt, text = '' }) {
    const { data } = await complete({ prompt });
    const [choice] = data.choices;
    prompt += choice.text.trim();
    text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
    const res = { prompt, text };
    return choice.finish_reason === FINISH_REASON_STOP ? res : this.chat(res);
  }
}

export default Assistant;
