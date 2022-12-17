import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  settings, getSession, handleEvents, removeSession,
} from '../app/index.js';
import { COMMAND_VERSION } from '../constants/command.js';
import storage from '../storage/index.js';
import { getVersion } from '../utils/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('COMMAND_VERSION', async () => {
  const events = createEvents([
    COMMAND_VERSION,
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  const version = getVersion();
  expect(getSession(USER_ID).lines.length).toEqual(1);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [version],
    ],
  );
}, TIMEOUT);
