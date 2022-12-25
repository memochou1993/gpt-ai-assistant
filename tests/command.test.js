import {
  afterEach,
  beforeEach,
  expect,
  test,
} from '@jest/globals';
import {
  getPrompt, handleEvents, removePrompt, settings,
} from '../app/index.js';
import { COMMAND_COMMAND } from '../constants/command.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(USER_ID);
});

test('COMMAND_COMMAND', async () => {
  const events = [
    ...createEvents([`${COMMAND_COMMAND.text}`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(USER_ID).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ altText }) => altText));
  expect(replies).toEqual(
    [
      [COMMAND_COMMAND.text],
    ],
  );
}, TIMEOUT);
