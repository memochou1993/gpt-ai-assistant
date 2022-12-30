import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_TALK } from '../constants/command.js';
import { createEvents, TIMEOUT, USER_ID_01 } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(USER_ID_01);
});

test('COMMAND_TALK', async () => {
  const events = [
    ...createEvents([`${COMMAND_TALK.text}人工智慧`]),
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
      ['OK!'],
    ],
  );
}, TIMEOUT);
