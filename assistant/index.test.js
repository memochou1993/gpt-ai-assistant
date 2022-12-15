import fs from 'fs';
import {
  afterEach,
  expect,
  test,
} from '@jest/globals';
import config from '../config/index.js';
import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
} from '../services/line/index.js';
import {
  COMMAND_VERSION,
  COMMAND_AI_AUTO_REPLY_OFF,
  COMMAND_AI_AUTO_REPLY_ON,
} from '../constants/command/index.js';
import Storage from '../storage/index.js';
import Assistant from './assistant.js';

const TIMEOUT = 9 * 1000;

const createEvents = (messages) => messages.map((message) => ({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: { type: 'user', userId: '000000' },
  message: { type: MESSAGE_TYPE_TEXT, text: message },
}));

afterEach(() => {
  Storage.write({});
});

test('DEFAULT', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    '嗨',
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
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

test('COMMAND_VERSION', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_VERSION,
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  const { version } = JSON.parse(fs.readFileSync('package.json'));
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        replies: expect.arrayContaining([
          version,
        ]),
      }),
    ]),
  );
}, TIMEOUT);

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
    console.error(err.toJSON());
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
    console.error(err.toJSON());
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
    console.error(err.toJSON());
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
