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
  c.headers.Authorization = `Bearer ${config.VERCEL_API_KEY}`;
  return c;
});

export const fetchEnvironments = () => instance.get(`/v9/projects/${config.VERCEL_GIT_REPO_SLUG}/env`);

export const createEnvironment = ({
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

export const updateEnvironment = ({
  id,
  value,
  type = 'encrypted',
  target = ['production', 'preview', 'development'],
}) => instance.patch(`/v9/projects/${config.VERCEL_GIT_REPO_SLUG}/env/${id}`, {
  value: String(value),
  type,
  target,
});

export const deploy = () => instance.post(config.VERCEL_WEBHOOK_URL);

export default null;
