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
import History from './history.mjs';

class Assistant {
  history = new History();

  constructor(text) {
    this.history.push(PARTICIPANT_AI, text);
  }

  reply(events = []) {
    const replies = events
      .filter(({ type }) => type === EVENT_TYPE_MESSAGE)
      .map(async ({ replyToken, message }) => {
        this.history.push(PARTICIPANT_HUMAN, `${message.text}？`);
        const { text } = await this.chat({ history: this.history.toString() });
        this.history.push(PARTICIPANT_AI, text);
        const messages = [{ type: MESSAGE_TYPE_TEXT, text }];
        const payload = { replyToken, messages };
        return APP_ENV === 'local' ? payload : reply(payload);
      });
    return Promise.all(replies);
  }

  async chat({ history, text = '' }) {
    const { data } = await complete(history);
    const [choice] = data.choices;
    history += choice.text.trim();
    text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
    const res = { history, text };
    return choice.finish_reason === FINISH_REASON_STOP ? res : this.chat(res);
  }
}

export default Assistant;
