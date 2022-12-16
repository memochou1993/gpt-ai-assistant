import {
  expect,
  test,
} from '@jest/globals';
import fs from 'fs';
import Assistant from '../../assistant/assistant.js';
import {
  COMMAND_VERSION,
} from '../../constants/command/index.js';
import {
  createEvents,
} from '../utils.js';

const TIMEOUT = 9 * 1000;

test('COMMAND_VERSION', async () => {
  const assistant = new Assistant();
  const events = createEvents([
    COMMAND_VERSION,
  ]);
  let results;
  try {
    results = await assistant.handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  const { version } = JSON.parse(fs.readFileSync('package.json'));
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        replies: expect.arrayContaining([
          version,
        ]),
      }),
    ]),
  );
}, TIMEOUT);
