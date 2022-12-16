import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  settings, handleEvents, getSession, printSessions, removeSession,
} from '../app/index.js';
import config from '../config/index.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('DEFAULT', async () => {
  const events = createEvents([
    '嗨',
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3); // ['AI', 'Human', 'AI']
  expect(results.length).toEqual(1); // ['Command', 'AI']
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            text: expect.any(String),
          }),
        ]),
      }),
    ]),
  );
  if (config.APP_DEBUG) printSessions();
}, TIMEOUT);
