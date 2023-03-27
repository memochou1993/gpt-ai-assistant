import express from 'express';
import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

app.get('/', (req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;
  }
  res.sendStatus(200);
});

app.get('/info', async (req, res) => {
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({ currentVersion, latestVersion });
});

const retryHandleEvents = async (events, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await handleEvents(events);
      return;
    } catch (err) {
      if (err.response?.status === 504) {
        console.error(`Attempt ${i + 1} failed with a 504 error. Retrying...`);
      } else {
        throw err;
      }
    }
  }
  throw new Error('All retry attempts failed with a 504 error.');
};

app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    await storage.initialize();
    await retryHandleEvents(req.body.events);
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    if (err.config?.baseURL) console.error(`${err.config.method.toUpperCase()} ${err.config.baseURL}${err.config.url}`);
    if (err.response?.data) console.error(err.response.data);
    res.sendStatus(500);
  }
  if (config.APP_DEBUG) printPrompts();
});

if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
