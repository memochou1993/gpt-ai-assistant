import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getPrompt, handleEvents, removePrompt, settings,
} from '../app/index.js';
import { COMMAND_ACTIVATE, COMMAND_DEACTIVATE } from '../constants/command.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(USER_ID);
});

test('COMMAND_ACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_DEACTIVATE.text]),
    ...createEvents(['嗨']), // should be ignored
    ...createEvents([COMMAND_ACTIVATE.text]),
    ...createEvents(['嗨']),
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
