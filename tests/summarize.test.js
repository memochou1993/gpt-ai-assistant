import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_CHAT, COMMAND_SUMMARIZE } from '../constants/command.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(async () => {
  //
});

afterEach(() => {
  removePrompt(USER_ID);
});

test('COMMAND_SUMMARIZE', async () => {
  try {
    await handleEvents(createEvents([`${COMMAND_CHAT.text}人工智慧`]));
  } catch (err) {
    console.error(err);
  }
  const events = [
    ...createEvents([`${COMMAND_SUMMARIZE.text}`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(USER_ID).lines.length).toEqual(5 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['OK!'],
    ],
  );
}, TIMEOUT);
