import axios from 'axios';
import config from '../../config/index.js';

const instance = axios.create({
  baseURL: 'https://api.vercel.com',
  timeout: 9 * 1000,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

instance.interceptors.request.use((c) => {
  c.headers.Authorization = `Bearer ${config.VERCEL_ACCESS_TOKEN}`;
  return c;
});

const fetchEnvironments = () => instance.get(`/v9/projects/${config.VERCEL_GIT_REPO_SLUG}/env`);

const createEnvironment = ({
  key,
  value,
  type = 'encrypted',
  target = ['production', 'preview', 'development'],
}) => instance.post(`/v10/projects/${config.VERCEL_GIT_REPO_SLUG}/env`, {
  key: String(key),
  value: String(value),
  type,
  target,
});

const updateEnvironment = ({
  id,
  value,
  type = 'encrypted',
  target = ['production', 'preview', 'development'],
}) => instance.patch(`/v9/projects/${config.VERCEL_GIT_REPO_SLUG}/env/${id}`, {
  value: String(value),
  type,
  target,
});

const deploy = () => axios.post(config.VERCEL_WEBHOOK_URL);

export {
  fetchEnvironments,
  createEnvironment,
  updateEnvironment,
  deploy,
};
