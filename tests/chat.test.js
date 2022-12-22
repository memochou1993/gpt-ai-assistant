import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getSession, handleEvents, printSessions, removeSession, settings,
} from '../app/index.js';
import config from '../config/index.js';
import {
  COMMAND_AI, COMMAND_CHAT, COMMAND_DISABLE_AUTO_REPLY, COMMAND_ENABLE_AUTO_REPLY,
} from '../constants/command.js';
import storage from '../storage/index.js';
import {
  createMessageEvents, createPostbackEvents, TIMEOUT, USER_ID,
} from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('DEFAULT', async () => {
  const events = [
    ...createMessageEvents(['嗨']),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['OK'],
    ],
  );
  if (config.APP_DEBUG) printSessions();
}, TIMEOUT);

test('COMMAND_CHAT', async () => {
  const events = [
    ...createPostbackEvents([COMMAND_DISABLE_AUTO_REPLY.text]),
    ...createMessageEvents([`${COMMAND_CHAT.text} 嗨`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['off'],
      ['OK'],
    ],
  );
}, TIMEOUT);

test('COMMAND_AI', async () => {
  const events = [
    ...createPostbackEvents([COMMAND_DISABLE_AUTO_REPLY.text]),
    ...createMessageEvents([`${COMMAND_AI.text} 嗨`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['off'],
      ['OK'],
    ],
  );
}, TIMEOUT);

test('COMMAND_ENABLE_AUTO_REPLY', async () => {
  const events = [
    ...createPostbackEvents([COMMAND_DISABLE_AUTO_REPLY.text]),
    ...createMessageEvents(['嗨']), // should be ignored
    ...createPostbackEvents([COMMAND_ENABLE_AUTO_REPLY.text]),
    ...createMessageEvents(['嗨']),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3 * 2);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['off'],
      ['on'],
      ['OK'],
    ],
  );
}, TIMEOUT);

test('COMMAND_DISABLE_AUTO_REPLY', async () => {
  const events = [
    ...createPostbackEvents([COMMAND_DISABLE_AUTO_REPLY.text]),
    ...createMessageEvents(['嗨']), // should be ignored
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
      ['off'],
    ],
  );
}, TIMEOUT);
