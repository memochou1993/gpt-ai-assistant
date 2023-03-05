import config from '../config/index.js';
import { mockGroups } from '../constants/mock.js';
import { t } from '../locales/index.js';
import { fetchGroupSummary } from '../services/line.js';

class Group {
  groupName;

  constructor({
    groupName,
  }) {
    this.groupName = groupName;
  }
}

/**
 * @param {string} groupId
 * @returns {Promise<Group>}
 */
const fetchGroup = async (groupId) => {
  if (config.APP_ENV !== 'production') return new Group(mockGroups[groupId]);
  try {
    const { data } = await fetchGroupSummary({ groupId });
    return new Group(data);
  } catch {
    return new Group({ groupName: t('__SOURCE_NAME_SOME_GROUP') });
  }
};

export default fetchGroup;
