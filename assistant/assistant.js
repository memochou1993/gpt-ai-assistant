import {
  APP_ENV,
  APP_DEBUG,
} from '../config/index.js';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
  FINISH_REASON_STOP,
  complete,
} from '../services/openai.js';
import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
  reply,
} from '../services/line.js';
import Storage from './storage.js';

class Assistant {
  storage = new Storage();

  handleEvents(events = []) {
    return Promise.all(events.map((event) => this.handleEvent(event)));
  }

  async handleEvent({
    replyToken,
    type,
    source,
    message,
  }) {
    if (type !== EVENT_TYPE_MESSAGE) return null;
    if (message.type !== MESSAGE_TYPE_TEXT) return null;
    const prompt = this.storage.getPrompt(source.userId);
    prompt.write(`${PARTICIPANT_HUMAN}: ${message.text}？`);
    try {
      const { text } = await this.chat({ prompt: prompt.toString() });
      prompt.write(`${PARTICIPANT_AI}: ${text}`);
      this.storage.setPrompt(source.userId, prompt);
      const res = { replyToken, messages: [{ type: message.type, text }] };
      return APP_ENV === 'local' ? res : reply(res);
    } catch (err) {
      console.error(err);
      return reply({ replyToken, messages: [{ type: message.type, text: err.message }] });
    }
  }

  async chat({
    prompt,
    text = '',
  }) {
    const { data } = await complete({ prompt });
    const [choice] = data.choices;
    prompt += choice.text.trim();
    text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
    const res = { prompt, text };
    return choice.finish_reason === FINISH_REASON_STOP ? res : this.chat(res);
  }

  debug() {
    if (APP_DEBUG) console.info(this.storage.toString());
  }
}

export default Assistant;
