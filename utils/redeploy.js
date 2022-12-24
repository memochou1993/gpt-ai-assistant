import config from '../config/index.js';
import { deploy } from '../services/vercel.js';

const redeploy = () => {
  if (config.APP_ENV !== 'production') return true;
  return deploy();
};

export default redeploy;
