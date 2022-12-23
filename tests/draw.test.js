import {
  afterEach,
  beforeEach, expect, test,
} from '@jest/globals';
import {
  settings, handleEvents, getSession, removeSession,
} from '../app/index.js';
import { COMMAND_DRAW } from '../constants/command.js';
import storage from '../storage/index.js';
import { createMessageEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('COMMAND_DRAW', async () => {
  const events = [
    ...createMessageEvents([`${COMMAND_DRAW.text}人工智慧`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ originalContentUrl }) => originalContentUrl));
  expect(replies).toEqual(
    [
      ['OK'],
    ],
  );
}, TIMEOUT);
