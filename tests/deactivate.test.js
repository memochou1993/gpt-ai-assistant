import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_DEACTIVATE } from '../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../constants/setting.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.setItem(SETTING_AI_ACTIVATED, true);
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
