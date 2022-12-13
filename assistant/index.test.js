import {
  expect,
  test,
} from '@jest/globals';
import {
  APP_DEBUG,
} from '../config/index.js';
import Assistant from './assistant.js';

test('assistant works', async () => {
  const assistant = new Assistant();
  const events = [
    {
      replyToken: '',
      type: 'message',
      source: {
        type: 'user',
        userId: '000000',
      },
      message: {
        type: 'text',
        text: '嗨',
      },
    },
  ];
  let res;
  try {
    res = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  events.forEach(({ source }) => {
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(3);
  });
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        text: expect.any(String),
      }),
    ]),
  );
  if (APP_DEBUG) assistant.printPrompts();
});
