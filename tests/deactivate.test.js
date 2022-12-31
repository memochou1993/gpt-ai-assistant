import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_DEACTIVATE } from '../constants/command.js';
import { SETTING_AI_ACTIVATED } from '../constants/setting.js';
import { t } from '../locales/index.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, MOCK_USER_01 } from './utils.js';

beforeEach(() => {
  storage.setItem(SETTING_AI_ACTIVATED, true);
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_DEACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_DEACTIVATE.text]),
    ...createEvents(['嗨！']), // should be ignored
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(MOCK_USER_01).sentences.length).toEqual(1 );
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [
        t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'),
        COMMAND_DEACTIVATE.reply,
      ],
    ],
  );
}, TIMEOUT);
