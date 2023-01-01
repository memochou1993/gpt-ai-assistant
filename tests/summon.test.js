import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import config from '../config/index.js';
import { SETTING_BOT_ACTIVATED } from '../constants/setting.js';
import storage from '../storage/index.js';
import {
  createEvents, TIMEOUT, MOCK_USER_01, MOCK_TEXT_OK,
} from './utils.js';

beforeEach(() => {
  storage.setItem(SETTING_BOT_ACTIVATED, false);
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_SUMMON', async () => {
  const events = [
    ...createEvents([`${config.BOT_NAME} 你好`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(MOCK_USER_01).sentences.length).toEqual(3);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [MOCK_TEXT_OK],
    ],
  );
}, TIMEOUT);
