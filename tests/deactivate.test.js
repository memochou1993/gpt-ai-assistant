import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_ACTIVATE, COMMAND_DEACTIVATE } from '../constants/command.js';
import { t } from '../locales/index.js';
import storage from '../storage/index.js';
import {
  createEvents, MOCK_TEXT_OK, MOCK_USER_01, TIMEOUT,
} from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_DEACTIVATE', async () => {
  const events = [
    ...createEvents([COMMAND_ACTIVATE.text]),
    ...createEvents(['嗨！']),
    ...createEvents([COMMAND_DEACTIVATE.text]),
    ...createEvents(['嗨！']), // should be ignored
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
      [
        t('__ERROR_MISSING_ENV')('VERCEL_ACCESS_TOKEN'),
        COMMAND_DEACTIVATE.reply,
      ],
    ],
  );
}, TIMEOUT);
