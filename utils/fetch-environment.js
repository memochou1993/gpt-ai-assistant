import { fetchEnvironments } from '../services/vercel.js';

const fetchEnvironment = async (key) => {
  // FIXME: should be removed
  console.log('fetchEnvironment');
  const { data } = await fetchEnvironments();
  return data.envs.find((env) => env.key === key);
};

export default fetchEnvironment;
