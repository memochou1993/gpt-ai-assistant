import {
  expect,
  test,
} from '@jest/globals';
import Assistant from '../../assistant/assistant.js';
import config from '../../config/index.js';
import {
  COMMAND_AI_AUTO_REPLY_OFF,
  COMMAND_AI_AUTO_REPLY_ON,
} from '../../constants/command/index.js';
import {
  createEvents,
} from '../utils.js';

const TIMEOUT = 9 * 1000;

test('COMMAND_AI', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    'ai 嗨',
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
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(2);
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

test('COMMAND_AI_AUTO_REPLY_ON', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨', // ignored
    COMMAND_AI_AUTO_REPLY_ON,
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
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(3);
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        replies: expect.arrayContaining([
          'on',
        ]),
      }),
    ]),
  );
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_OFF', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨', // ignored
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  events.forEach(({ source }) => {
    expect(assistant.getPrompt(source.userId).lines.length).toEqual(1);
  });
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(1);
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        replies: expect.arrayContaining([
          'off',
        ]),
      }),
    ]),
  );
}, TIMEOUT);
