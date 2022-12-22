import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getSession, handleEvents, removeSession, settings,
} from '../app/index.js';
import { COMMAND_ACTIVATE, COMMAND_DEACTIVATE } from '../constants/command.js';
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

test('COMMAND_ACTIVATE', async () => {
  const events = [
    ...createPostbackEvents([COMMAND_DEACTIVATE.text]),
    ...createMessageEvents(['嗨']), // should be ignored
    ...createPostbackEvents([COMMAND_ACTIVATE.text]),
    ...createMessageEvents(['嗨']),
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
      [COMMAND_ACTIVATE.reply],
      ['OK'],
    ],
  );
}, TIMEOUT);
