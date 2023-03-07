import axios from 'axios';
import config from '../config/index.js';
import { handleFulfilled, handleRejected, handleRequest } from './utils/index.js';

const client = axios.create({
  baseURL: 'https://serpapi.com',
  timeout: config.SERPAPI_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

client.interceptors.request.use((c) => {
  c.params = {
    key: config.SERPAPI_API_KEY,
    ...c.params,
  };
  return handleRequest(c);
});

client.interceptors.response.use(handleFulfilled, (err) => {
  if (err.response?.data?.error) {
    err.message = err.response.data.error;
  }
  return handleRejected(err);
});

const search = ({
  lr = config.SERPAPI_LOCATION,
  location = config.SERPAPI_LOCATION,
  q,
}) => client.get('/search', {
  params: {
    lr,
    location,
    q,
  },
});

export {
  search,
};

export default null;
