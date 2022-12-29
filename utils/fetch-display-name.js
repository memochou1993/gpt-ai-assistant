import config from '../config/index.js';
import { users } from '../constants/mock.js';
import { fetchProfile } from '../services/line.js';

const fetchDisplayName = async (userId) => {
  if (config.APP_ENV !== 'production') return users[userId];
  const { data } = await fetchProfile({ userId });
  return data.displayName;
};

export default fetchDisplayName;
