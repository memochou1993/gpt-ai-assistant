import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_ACT_SUM, COMMAND_SYS_TALK } from '../constants/command.js';
import { MOCK_GROUP_01 } from '../constants/mock.js';
import {
  createEvents, MOCK_TEXT_OK, MOCK_USER_01, MOCK_USER_02, TIMEOUT,
} from './utils.js';

beforeEach(async () => {
  //
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
  removePrompt(MOCK_USER_02);
});

test('COMMAND_ENQUIRE', async () => {
  try {
    await handleEvents(createEvents([`${COMMAND_SYS_TALK.text}人工智慧`], MOCK_GROUP_01, MOCK_USER_01));
  } catch (err) {
    console.error(err);
  }
  const events = [
    ...createEvents([`${COMMAND_ACT_SUM.text}`], MOCK_GROUP_01, MOCK_USER_02),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(MOCK_USER_01).sentences.length).toEqual(3);
  expect(getPrompt(MOCK_USER_02).sentences.length).toEqual(4);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [MOCK_TEXT_OK],
    ],
  );
}, TIMEOUT);
