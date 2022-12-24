import {
  afterEach,
  beforeEach,
  expect,
  test,
} from '@jest/globals';
import {
  getSession, handleEvents, removeSession, settings,
} from '../app/index.js';
import { COMMAND_CONFIGURE } from '../constants/command.js';
import { SETTING_IMAGE_GENERATION_SIZE } from '../constants/setting.js';
import storage from '../storage/index.js';
import { createMessageEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('COMMAND_CONFIGURE FOO', async () => {
  const events = [
    ...createMessageEvents([`${COMMAND_CONFIGURE.text} ${SETTING_IMAGE_GENERATION_SIZE}`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [JSON.stringify(settings[SETTING_IMAGE_GENERATION_SIZE])],
    ],
  );
}, TIMEOUT);

test('COMMAND_CONFIGURE FOO=', async () => {
  const events = [
    ...createMessageEvents([`${COMMAND_CONFIGURE.text} ${SETTING_IMAGE_GENERATION_SIZE}=`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [COMMAND_CONFIGURE.reply],
    ],
  );
  expect(await storage.getItem(SETTING_IMAGE_GENERATION_SIZE)).toEqual('');
}, TIMEOUT);

test('COMMAND_CONFIGURE FOO=BAR', async () => {
  const events = [
    ...createMessageEvents([`${COMMAND_CONFIGURE.text} ${SETTING_IMAGE_GENERATION_SIZE}=BAR`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(1 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      [COMMAND_CONFIGURE.reply],
    ],
  );
  expect(await storage.getItem(SETTING_IMAGE_GENERATION_SIZE)).toEqual('BAR');
}, TIMEOUT);
