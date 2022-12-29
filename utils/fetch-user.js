import config from '../config/index.js';
import { users } from '../constants/mock.js';
import { fetchProfile } from '../services/line.js';

const fetchUser = async (userId) => {
  if (config.APP_ENV !== 'production') return users[userId];
  const { data } = await fetchProfile({ userId });
  return data;
};

export default fetchUser;
