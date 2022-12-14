import express from 'express';
import {
  APP_DEBUG,
  APP_URL,
  APP_PORT,
} from '../config/index.js';
import {
  validateLineSignature,
} from '../middleware/index.js';
import Assistant from '../assistant/index.js';

const assistant = new Assistant();

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

app.get('/', (req, res) => {
  if (APP_URL) {
    res.redirect(APP_URL);
    return;
  }
  res.sendStatus(200);
});

app.post('/webhook', validateLineSignature, async (req, res) => {
  try {
    await assistant.handleEvents(req.body.events);
  } catch (err) {
    console.error(err.toJSON());
    res.sendStatus(500);
    return;
  }
  if (APP_DEBUG) assistant.printPrompts();
  res.sendStatus(200);
});

if (APP_PORT) {
  app.listen(APP_PORT);
}

export default app;
