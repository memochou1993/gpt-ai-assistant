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
  COMMAND_GET_VERSION,
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

test('assistant works', async () => {
  const assistant = new Assistant();
  const events = createEvents(['嗨']);
  let actual;
  try {
    actual = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  events.forEach(({ source }) => {
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(3);
  });
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        expect.any(String),
      ]),
    }),
  ]);
  expect(actual).toEqual(expected);
  if (config.APP_DEBUG) assistant.printPrompts();
}, TIMEOUT);

test('get version command works', async () => {
  const assistant = new Assistant();
  const events = createEvents([COMMAND_GET_VERSION]);
  let actual;
  try {
    actual = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const expected = expect.arrayContaining([
    expect.objectContaining({
      replies: expect.arrayContaining([
        version,
      ]),
    }),
  ]);
  expect(actual).toEqual(expected);
}, TIMEOUT);
