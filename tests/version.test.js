import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_SYS_VERSION } from '../constants/command.js';
import { getVersion } from '../utils/index.js';
import { createEvents, TIMEOUT, MOCK_USER_01 } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_SYS_VERSION', async () => {
  const events = [
    ...createEvents([COMMAND_SYS_VERSION.text]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  const version = getVersion();
  expect(getPrompt(MOCK_USER_01).sentences.length).toEqual(1 );
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [version],
    ],
  );
}, TIMEOUT);
