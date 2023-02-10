import axios from 'axios';
import config from '../config/index.js';

export const ENV_TYPE_ENCRYPTED = 'encrypted';
export const ENV_TYPE_PLAIN = 'plain';

export const ENV_TARGET_PRODUCTION = 'production';
export const ENV_TARGET_PREVIEW = 'preview';
export const ENV_TARGET_DEVELOPMENT = 'development';

const instance = axios.create({
  baseURL: 'https://api.vercel.com',
  timeout: config.VERCEL_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

instance.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.VERCEL_ACCESS_TOKEN}`;
  return c;
});

const fetchEnvironments = () => instance.get(`/v9/projects/${config.VERCEL_PROJECT_NAME}/env`);

const createEnvironment = ({
  key,
  value,
  type = ENV_TYPE_ENCRYPTED,
  target = [ENV_TARGET_PRODUCTION, ENV_TARGET_PREVIEW, ENV_TARGET_DEVELOPMENT],
}) => instance.post(`/v10/projects/${config.VERCEL_PROJECT_NAME}/env`, {
  key: String(key),
  value: String(value),
  type,
  target,
});

const updateEnvironment = ({
  id,
  value,
  type = ENV_TYPE_ENCRYPTED,
  target = [ENV_TARGET_PRODUCTION, ENV_TARGET_PREVIEW, ENV_TARGET_DEVELOPMENT],
}) => instance.patch(`/v9/projects/${config.VERCEL_PROJECT_NAME}/env/${id}`, {
  value: String(value),
  type,
  target,
});

const deploy = () => axios.post(config.VERCEL_DEPLOY_HOOK_URL);

export {
  fetchEnvironments,
  createEnvironment,
  updateEnvironment,
  deploy,
};
