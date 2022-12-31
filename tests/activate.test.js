import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_ACTIVATE } from '../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../constants/setting.js';
import { t } from '../locales/index.js';
import storage from '../storage/index.js';
import {
  createEvents, TIMEOUT, MOCK_USER_01, MOCK_TEXT_OK,
} from './utils.js';

beforeEach(() => {
  storage.setItem(SETTING_AI_ACTIVATED, false);
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_ACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_ACTIVATE.text]),
    ...createEvents(['嗨！']),
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
      [
        t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'),
        COMMAND_ACTIVATE.reply,
      ],
      [MOCK_TEXT_OK],
    ],
  );
}, TIMEOUT);
