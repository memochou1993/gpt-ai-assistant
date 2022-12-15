import fs from 'fs';
import {
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
import Assistant from './assistant.js';

const TIMEOUT = 9 * 1000;

const createEvents = (texts) => texts.map((text) => ({
  replyToken: '',
  type: EVENT_TYPE_MESSAGE,
  source: {
    type: 'user',
    userId: '000000',
  },
  message: {
    type: MESSAGE_TYPE_TEXT,
    text,
  },
}));

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
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(3);
  });
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(1);
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        expect.any(String),
      ]),
    }),
  ]);
  expect(results).toEqual(expected);
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
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(1);
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        version,
      ]),
    }),
  ]);
  expect(results).toEqual(expected);
}, TIMEOUT);

test('COMMAND_AI', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    'ai 嗨',
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
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(3);
  });
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(4);
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        expect.any(String),
      ]),
    }),
    expect.objectContaining({
      replies: expect.arrayContaining([
        expect.any(String),
      ]),
    }),
  ]);
  expect(results).toEqual(expected);
  if (config.APP_DEBUG) assistant.printPrompts();
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_ON', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_ON,
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  events.forEach(({ source }) => {
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(1);
  });
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(1);
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        'on',
      ]),
    }),
  ]);
  expect(results).toEqual(expected);
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_OFF', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨',
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  events.forEach(({ source }) => {
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(1);
  });
  expect(results.filter(({ replies }) => replies.length > 0).length).toEqual(1);
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        'off',
      ]),
    }),
  ]);
  expect(results).toEqual(expected);
}, TIMEOUT);
