import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { getPrompt, handleEvents, removePrompt } from '../app/index.js';
import { COMMAND_CONFIGURE } from '../constants/command.js';
import { SETTING_PREFIX } from '../constants/setting.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, MOCK_USER_01 } from './utils.js';

beforeEach(() => {
  storage.removeItem('SETTING_FOO');
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_CONFIGURE SETTING_FOO', async () => {
  const events = [
    ...createEvents([`${COMMAND_CONFIGURE.text} ${SETTING_PREFIX}_FOO`]),
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
      ['undefined'],
    ],
  );
  expect(await storage.getItem(`${SETTING_PREFIX}_FOO`)).toEqual(undefined);
}, TIMEOUT);

test('COMMAND_CONFIGURE SETTING_FOO=', async () => {
  const events = [
    ...createEvents([`${COMMAND_CONFIGURE.text} ${SETTING_PREFIX}_FOO=`]),
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
      [COMMAND_CONFIGURE.reply],
    ],
  );
  expect(await storage.getItem(`${SETTING_PREFIX}_FOO`)).toEqual('');
}, TIMEOUT);

test('COMMAND_CONFIGURE SETTING_FOO=BAR', async () => {
  const events = [
    ...createEvents([`${COMMAND_CONFIGURE.text} ${SETTING_PREFIX}_FOO=BAR`]),
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
      [COMMAND_CONFIGURE.reply],
    ],
  );
  expect(await storage.getItem(`${SETTING_PREFIX}_FOO`)).toEqual('BAR');
}, TIMEOUT);

test('COMMAND_CONFIGURE FOO', async () => {
  const events = [
    ...createEvents([`${COMMAND_CONFIGURE.text} FOO`]),
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
    [],
  );
  expect(await storage.getItem(`${SETTING_PREFIX}_FOO`)).toEqual(undefined);
}, TIMEOUT);

test('COMMAND_CONFIGURE FOO=', async () => {
  const events = [
    ...createEvents([`${COMMAND_CONFIGURE.text} FOO=`]),
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
    [],
  );
  expect(await storage.getItem(`${SETTING_PREFIX}_FOO`)).toEqual(undefined);
}, TIMEOUT);

test('COMMAND_CONFIGURE FOO=BAR', async () => {
  const events = [
    ...createEvents([`${COMMAND_CONFIGURE.text} FOO=BAR`]),
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
    [],
  );
  expect(await storage.getItem(`${SETTING_PREFIX}_FOO`)).toEqual(undefined);
}, TIMEOUT);
