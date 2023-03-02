import { ROLE_HUMAN } from '../services/openai.js';

export const MOCK_TEXT_OK = '好的！';

export const MOCK_GROUP_01 = '000001';
export const MOCK_GROUP_02 = '000002';

export const MOCK_USER_01 = '000001';
export const MOCK_USER_02 = '000002';

const mockUsers = {};
mockUsers[MOCK_USER_01] = { displayName: `${ROLE_HUMAN}` };
mockUsers[MOCK_USER_02] = { displayName: `${ROLE_HUMAN} 2` };

export {
  mockUsers,
};
