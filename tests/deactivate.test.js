import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getPrompt, handleEvents, removePrompt, settings,
} from '../app/index.js';
import { COMMAND_DEACTIVATE } from '../constants/command.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removePrompt(USER_ID);
});

test('COMMAND_DEACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_DEACTIVATE.text]),
    ...createEvents(['嗨']), // should be ignored
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(USER_ID).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [COMMAND_DEACTIVATE.reply],
    ],
  );
}, TIMEOUT);
