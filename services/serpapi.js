import axios from 'axios';
import config from '../config/index.js';

const instance = axios.create({
  baseURL: 'https://serpapi.com',
  timeout: config.SERPAPI_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

const search = ({
  lr = 'lang_zh-TW',
  q,
}) => instance.get('/search', {
  params: {
    key: config.SERPAPI_API_KEY,
    lr,
    q,
  },
});

export {
  search,
};

export default null;
