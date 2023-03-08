import axios from 'axios';
import config from '../config/index.js';
import { handleFulfilled, handleRejected, handleRequest } from './utils/index.js';

export const ENV_TYPE_ENCRYPTED = 'encrypted';
export const ENV_TYPE_PLAIN = 'plain';

export const ENV_TARGET_PRODUCTION = 'production';
export const ENV_TARGET_PREVIEW = 'preview';
export const ENV_TARGET_DEVELOPMENT = 'development';

const client = axios.create({
  baseURL: 'https://api.vercel.com',
  timeout: config.VERCEL_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

client.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.VERCEL_ACCESS_TOKEN}`;
  return handleRequest(c);
});

client.interceptors.response.use(handleFulfilled, (err) => {
  if (err.response?.data?.error?.message) {
    err.message = err.response.data.error.message;
  }
  return handleRejected(err);
});

const fetchEnvironments = () => client.get(`/v9/projects/${config.VERCEL_PROJECT_NAME}/env`, {
  params: {
    ...(config.VERCEL_TEAM_ID ? { teamId: config.VERCEL_TEAM_ID } : {}),
  },
});

const createEnvironment = ({
  key,
  value,
  type = ENV_TYPE_ENCRYPTED,
  target = [ENV_TARGET_PRODUCTION, ENV_TARGET_PREVIEW, ENV_TARGET_DEVELOPMENT],
}) => client.post(`/v10/projects/${config.VERCEL_PROJECT_NAME}/env`, {
  key: String(key),
  value: String(value),
  type,
  target,
}, {
  params: {
    ...(config.VERCEL_TEAM_ID ? { teamId: config.VERCEL_TEAM_ID } : {}),
  },
});

const updateEnvironment = ({
  id,
  value,
  type = ENV_TYPE_ENCRYPTED,
  target = [ENV_TARGET_PRODUCTION, ENV_TARGET_PREVIEW, ENV_TARGET_DEVELOPMENT],
}) => client.patch(`/v9/projects/${config.VERCEL_PROJECT_NAME}/env/${id}`, {
  value: String(value),
  type,
  target,
}, {
  params: {
    ...(config.VERCEL_TEAM_ID ? { teamId: config.VERCEL_TEAM_ID } : {}),
  },
});

const deploy = () => axios.post(config.VERCEL_DEPLOY_HOOK_URL);

export {
  fetchEnvironments,
  createEnvironment,
  updateEnvironment,
  deploy,
};
