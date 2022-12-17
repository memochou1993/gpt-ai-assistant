import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import {
  settings, handleEvents, getSession, removeSession,
} from '../app/index.js';
import { COMMAND_AI_AUTO_REPLY_OFF, COMMAND_AI_AUTO_REPLY_ON } from '../constants/command.js';
import storage from '../storage/index.js';
import { createEvents, TIMEOUT, USER_ID } from './utils.js';

beforeEach(() => {
  storage.initialize(settings);
});

afterEach(() => {
  removeSession(USER_ID);
});

test('COMMAND_AI', async () => {
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    'ai 嗨',
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['off'],
      [''],
    ],
  );
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_ON', async () => {
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨', // should be ignored
    COMMAND_AI_AUTO_REPLY_ON,
    '嗨',
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(3);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['off'],
      ['on'],
      [''],
    ],
  );
}, TIMEOUT);

test('COMMAND_AI_AUTO_REPLY_OFF', async () => {
  const events = createEvents([
    COMMAND_AI_AUTO_REPLY_OFF,
    '嗨', // should be ignored
  ]);
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getSession(USER_ID).lines.length).toEqual(1);
  const replies = results.map(({ messages }) => messages.map(({ text }) => text));
  expect(replies).toEqual(
    [
      ['off'],
    ],
  );
}, TIMEOUT);
