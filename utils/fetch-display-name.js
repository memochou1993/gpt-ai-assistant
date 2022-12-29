import config from '../config/index.js';
import { fetchProfile } from '../services/line.js';
import { PARTICIPANT_HUMAN } from '../services/openai.js';

const fetchDisplayName = async (userId) => {
  if (config.APP_ENV !== 'production') return PARTICIPANT_HUMAN;
  const { data } = await fetchProfile({ userId });
  return data.displayName;
};

export default fetchDisplayName;
