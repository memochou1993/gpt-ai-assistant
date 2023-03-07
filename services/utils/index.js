import config from '../../config/index.js';

const handleRequest = (c) => {
  c.metadata = { startTime: new Date() };
  return c;
};

const handleFulfilled = (response) => {
  if (config.APP_DEBUG) console.info(`[${response.status}] ${response.config.method.toUpperCase()} ${response.config.baseURL}${response.config.url} (${(new Date() - response.config.metadata.startTime)}ms)`);
  return response;
};

const handleRejected = (err) => {
  if (config.APP_DEBUG) console.info(`[${err.response?.status || 500}] ${err.config.method.toUpperCase()} ${err.config.baseURL}${err.config.url} (${(new Date() - err.config.metadata.startTime)}ms)`);
  return Promise.reject(err);
};

export {
  handleRequest,
  handleFulfilled,
  handleRejected,
};
