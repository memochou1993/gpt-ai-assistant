import express from 'express';
import Assistant from '../assistant/index.js';
import {
  validateSignature,
} from '../utils/index.js';
import {
  APP_ENV,
  APP_PORT,
  LINE_API_SECRET,
} from '../config/index.js';

const assistant = new Assistant();

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

app.use((req, res, next) => {
  const signature = req.header('x-line-signature');
  if (LINE_API_SECRET && !validateSignature(req.rawBody, LINE_API_SECRET, signature)) {
    res.sendStatus(403);
    return;
  }
  next();
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/webhook', async (req, res) => {
  try {
    await assistant.handleEvents(req.body.events);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
  assistant.debug();
  res.sendStatus(200);
});

if (APP_ENV === 'local') {
  app.listen(APP_PORT);
}

export default app;
