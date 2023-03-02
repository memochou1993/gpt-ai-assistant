import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_SYS_VERSION } from '../app/commands/index.js';
import { t } from '../locales/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';
import { createEvents, MOCK_USER_01, TIMEOUT } from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_SYS_VERSION', async () => {
  const events = [
    ...createEvents([COMMAND_SYS_VERSION.text]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  const current = getVersion();
  const latest = await fetchVersion();
  const isLatest = current === latest;
  expect(getPrompt(MOCK_USER_01).messages.length).toEqual(3);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [t('__COMMAND_SYS_VERSION_REPLY')(current, isLatest)],
    ],
  );
}, TIMEOUT);
