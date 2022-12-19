import express from 'express';
import { handleEvents, printSessions, settings } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';

storage.initialize(settings);

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

app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    await handleEvents(req.body.events);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  if (config.APP_DEBUG) printSessions();
});

if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
