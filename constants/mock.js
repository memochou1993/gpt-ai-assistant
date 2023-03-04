export const MOCK_TEXT_OK = 'OK!';

export const MOCK_GROUP_01 = '000001';
export const MOCK_GROUP_02 = '000002';

export const MOCK_USER_01 = '000001';
export const MOCK_USER_02 = '000002';

const mockGroups = {};
mockGroups[MOCK_GROUP_01] = { groupName: 'group' };
mockGroups[MOCK_USER_02] = { groupName: 'group 2' };

const mockUsers = {};
mockUsers[MOCK_USER_01] = { displayName: 'user' };
mockUsers[MOCK_USER_02] = { displayName: 'user 2' };

export {
  mockGroups,
  mockUsers,
};
