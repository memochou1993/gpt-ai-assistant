import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getSession, handleEvents, printSessions, removeSession, settings,
} from '../app/index.js';
import config from '../config/index.js';
import storage from '../storage/index.js';
import { createMessageEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('DEFAULT', async () => {
  const events = [
    ...createMessageEvents(['嗨']),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['OK!'],
    ],
  );
  if (config.APP_DEBUG) printSessions();
}, TIMEOUT);
