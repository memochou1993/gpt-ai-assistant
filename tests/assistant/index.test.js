import {
  expect,
  test,
} from '@jest/globals';
import Assistant from '../../assistant/assistant.js';
import config from '../../config/index.js';
import {
  createEvents,
} from '../utils.js';

const TIMEOUT = 9 * 1000;

test('DEFAULT', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    '嗨',
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  events.forEach(({ source }) => {
    expect(assistant.getPrompt(source.userId).lines.length).toEqual(3);
  });
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(1);
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        replies: expect.arrayContaining([
          expect.any(String),
        ]),
      }),
    ]),
  );
  if (config.APP_DEBUG) assistant.printPrompts();
}, TIMEOUT);
