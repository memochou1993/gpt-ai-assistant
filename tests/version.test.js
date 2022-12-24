import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  settings, getPrompt, handleEvents, removePrompt,
} from '../app/index.js';
import { COMMAND_VERSION } from '../constants/command.js';
import storage from '../storage/index.js';
import { getVersion } from '../utils/index.js';
import { createMessageEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removePrompt(USER_ID);
});

test('COMMAND_VERSION', async () => {
  const events = [
    ...createMessageEvents([COMMAND_VERSION.text]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  const version = getVersion();
  expect(getPrompt(USER_ID).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [version],
    ],
  );
}, TIMEOUT);
