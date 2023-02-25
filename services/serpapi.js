import axios from 'axios';
import config from '../config/index.js';

const instance = axios.create({
  baseURL: 'https://serpapi.com',
  timeout: config.SERPAPI_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

instance.interceptors.request.use((c) => {
  c.params = {
    key: config.SERPAPI_API_KEY,
    ...c.params,
  };
  return c;
});

const search = ({
  lr = config.SERPAPI_LOCATION,
  location = config.SERPAPI_LOCATION,
  q,
}) => instance.get('/search', {
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
