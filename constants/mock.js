import { PARTICIPANT_HUMAN } from '../services/openai.js';

export const TEXT_OK = 'OK!';

export const USER_ID_01 = '000001';
export const USER_ID_02 = '000002';

const users = {};
users[USER_ID_01] = `${PARTICIPANT_HUMAN} 1`;
users[USER_ID_02] = `${PARTICIPANT_HUMAN} 2`;

export {
  users,
};
