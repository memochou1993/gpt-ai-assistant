import {
  afterEach,
  beforeEach,
  expect,
  test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import config from '../config/index.js';
import { COMMAND_COMMAND } from '../constants/command.js';
import { createEvents, TIMEOUT, USER_ID_01 } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(USER_ID_01);
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
  expect(getPrompt(USER_ID_01).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ altText }) => altText));
  expect(replies).toEqual(
    [
      [config.SETTING_AI_NAME],
    ],
  );
}, TIMEOUT);
