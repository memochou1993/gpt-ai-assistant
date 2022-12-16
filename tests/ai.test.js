import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  settings, handleEvents, getSession, printSessions, removeSession,
} from '../app/index.js';
import config from '../config/index.js';
import { COMMAND_AI_AUTO_REPLY_OFF, COMMAND_AI_AUTO_REPLY_ON } from '../constants/command.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('COMMAND_AI', async () => {
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    'ai 嗨',
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3); // ['AI', 'Human', 'AI']
  expect(results.length).toEqual(2); // ['Command', 'AI']
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            text: 'off',
          }),
        ]),
      }),
    ]),
  );
  if (config.APP_DEBUG) printSessions();
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_ON', async () => {
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨', // ignored
    COMMAND_AI_AUTO_REPLY_ON,
    '嗨',
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3); // ['AI', 'Human', 'AI']
  expect(results.length).toEqual(3); // ['Command', 'Command', 'AI']
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            text: 'off',
          }),
        ]),
      }),
    ]),
  );
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_OFF', async () => {
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨', // ignored
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(1); // ['AI']
  expect(results.length).toEqual(1); // ['Command']
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            text: 'off',
          }),
        ]),
      }),
    ]),
  );
}, TIMEOUT);
