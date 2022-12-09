import express from 'express';
import Assistant from '../assistant/index.mjs';
import {
  APP_ENV,
  APP_PORT,
} from '../config/index.mjs';

const assistant = new Assistant('嗨！我可以怎麼幫助你？');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/webhook', async (req, res) => {
  await assistant.reply(req.body.events);
  console.info(assistant.prompt.toString());
  res.sendStatus(200);
});

if (APP_ENV === 'local') {
  app.listen(APP_PORT);
}

export default app;
