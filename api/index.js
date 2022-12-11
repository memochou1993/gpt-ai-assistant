import express from 'express';
import Assistant from '../assistant/index.js';
import {
  validator,
} from '../middleware/index.js';
import {
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

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/webhook', validator(LINE_API_SECRET), async (req, res) => {
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

if (APP_PORT) {
  app.listen(APP_PORT);
}

export default app;
