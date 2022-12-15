import express from 'express';
import Assistant from '../assistant/index.js';
import config from '../config/index.js';
import {
  validateLineSignature,
} from '../middleware/index.js';

const assistant = new Assistant();

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

app.post('/webhook', validateLineSignature, async (req, res) => {
  try {
    await assistant.handleEvents(req.body.events);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
  if (config.APP_DEBUG) assistant.printPrompts();
  res.sendStatus(200);
});

if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
