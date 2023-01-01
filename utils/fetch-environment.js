import { fetchEnvironments } from '../services/vercel.js';

const fetchEnvironment = async (key) => {
  const { data } = await fetchEnvironments();
  return data.envs.find((env) => env.key === key);
};

export default fetchEnvironment;
