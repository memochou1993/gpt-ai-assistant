import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  getSession, handleEvents, printSessions, removeSession, settings,
} from '../app/index.js';
import config from '../config/index.js';
import {
  ARG_AUTO_REPLY_OFF, ARG_AUTO_REPLY_ON, COMMAND_AI, COMMAND_CHAT,
} from '../constants/command.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('DEFAULT', async () => {
  const events = createEvents([
    '嗨',
  ]);
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
  const events = createEvents([
    `${COMMAND_CHAT} --${ARG_AUTO_REPLY_OFF}`,
    `${COMMAND_CHAT} 嗨`,
  ]);
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
  const events = createEvents([
    `${COMMAND_AI} --${ARG_AUTO_REPLY_OFF}`,
    `${COMMAND_AI} 嗨`,
  ]);
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

test('ARG_AUTO_REPLY_ON', async () => {
  const events = createEvents([
    `${COMMAND_CHAT} --${ARG_AUTO_REPLY_OFF}`,
    '嗨', // should be ignored
    `${COMMAND_CHAT} --${ARG_AUTO_REPLY_ON}`,
    '嗨',
  ]);
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

test('ARG_AUTO_REPLY_OFF', async () => {
  const events = createEvents([
    `${COMMAND_CHAT} --${ARG_AUTO_REPLY_OFF}`,
    '嗨', // should be ignored
  ]);
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
