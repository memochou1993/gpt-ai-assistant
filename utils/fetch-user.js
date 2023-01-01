import config from '../config/index.js';
import { mockUsers } from '../constants/mock.js';
import { t } from '../locales/index.js';
import { fetchProfile } from '../services/line.js';

class User {
  displayName;

  constructor({
    displayName,
  }) {
    this.displayName = displayName;
  }
}

/**
 * @param {string} userId
 * @returns {Promise<User>}
 */
const fetchUser = async (userId) => {
  if (config.APP_ENV !== 'production') return new User(mockUsers[userId]);
  try {
    const { data } = await fetchProfile({ userId });
    return new User(data);
  } catch {
    return new User({ displayName: t('__USER_DISPLAY_NAME_SOMEONE') });
  }
};

export default fetchUser;
