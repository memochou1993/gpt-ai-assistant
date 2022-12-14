import fs from 'fs';
import {
  expect,
  test,
} from '@jest/globals';
import {
  APP_DEBUG,
} from '../config/index.js';
import {
  COMMAND_GET_VERSION,
} from '../constants/command/index.js';
import Assistant from './assistant.js';

const TIMEOUT = 9 * 1000;

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
        replies: expect.arrayContaining([
          expect.any(String),
        ]),
      }),
    ]),
  );
  if (APP_DEBUG) assistant.printPrompts();
}, TIMEOUT);

test('get version command works', async () => {
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
        text: COMMAND_GET_VERSION,
      },
    },
  ];
  let res;
  try {
    res = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err.toJSON());
  }
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  events.forEach(({ source }) => {
    const { lines } = assistant.getPrompt(source.userId);
    expect(lines.length).toEqual(1);
  });
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        replies: expect.arrayContaining([
          version,
        ]),
      }),
    ]),
  );
  if (APP_DEBUG) assistant.printPrompts();
}, TIMEOUT);
