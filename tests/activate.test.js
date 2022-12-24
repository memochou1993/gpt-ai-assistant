import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getPrompt, handleEvents, removePrompt, settings,
} from '../app/index.js';
import { COMMAND_ACTIVATE, COMMAND_DEACTIVATE } from '../constants/command.js';
import storage from '../storage/index.js';
import { createMessageEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removePrompt(USER_ID);
});

test('COMMAND_ACTIVATE', async () => {
  const events = [
    ...createMessageEvents([COMMAND_DEACTIVATE.text]),
    ...createMessageEvents(['嗨']), // should be ignored
    ...createMessageEvents([COMMAND_ACTIVATE.text]),
    ...createMessageEvents(['嗨']),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [COMMAND_DEACTIVATE.reply],
      [COMMAND_ACTIVATE.reply],
      ['OK!'],
    ],
  );
}, TIMEOUT);
