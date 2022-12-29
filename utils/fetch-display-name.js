import { fetchProfile } from '../services/line.js';

const fetchDisplayName = async (userId) => {
  const { data } = await fetchProfile({ userId });
  return data.displayName;
};

export default fetchDisplayName;
