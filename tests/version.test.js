import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_VERSION } from '../constants/command.js';
import { getVersion } from '../utils/index.js';
import { createEvents, TIMEOUT, USER_ID_01 } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(USER_ID_01);
});

test('COMMAND_VERSION', async () => {
  const events = [
    ...createEvents([COMMAND_VERSION.text]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  const version = getVersion();
  expect(getPrompt(USER_ID_01).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [version],
    ],
  );
}, TIMEOUT);
