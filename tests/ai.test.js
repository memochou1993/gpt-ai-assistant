import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getSession, handleEvents, removeSession, settings,
} from '../app/index.js';
import { COMMAND_AI, COMMAND_DEACTIVATE } from '../constants/command.js';
import storage from '../storage/index.js';
import {
  createMessageEvents, createPostbackEvents, TIMEOUT, USER_ID,
} from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('COMMAND_AI', async () => {
  const events = [
    ...createPostbackEvents([COMMAND_DEACTIVATE.text]),
    ...createMessageEvents([`${COMMAND_AI.text} 嗨`]),
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
      [COMMAND_DEACTIVATE.reply],
      ['OK'],
    ],
  );
}, TIMEOUT);
