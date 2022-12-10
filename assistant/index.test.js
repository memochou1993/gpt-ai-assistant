import {
  expect,
  test,
} from '@jest/globals';
import Assistant from './index.js';

test('assistant works', async () => {
  const assistant = new Assistant();
  const events = [
    {
      type: 'message',
      message: {
        type: 'text',
        text: '嗨',
      },
      source: {
        type: 'user',
        userId: '00000',
      },
      replyToken: '',
    },
  ];
  const res = await assistant.handleEvents(events);
  assistant.debug();
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        messages: expect.arrayContaining([{
          text: expect.any(String),
          type: 'text',
        }]),
      }),
    ]),
  );
});
