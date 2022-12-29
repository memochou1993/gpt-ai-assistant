import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_ACTIVATE } from '../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../constants/setting.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID_01 } from './utils.js';

beforeEach(() => {
  storage.setItem(SETTING_AI_ACTIVATED, false);
});

afterEach(() => {
  removePrompt(USER_ID_01);
});

test('COMMAND_ACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_ACTIVATE.text]),
    ...createEvents(['嗨']),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(USER_ID_01).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [COMMAND_ACTIVATE.reply],
      ['OK!'],
    ],
  );
}, TIMEOUT);
