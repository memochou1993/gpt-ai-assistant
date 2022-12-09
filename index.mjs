import {
  chat,
  TITLE_AI,
  TITLE_HUMAN,
} from './api.mjs';

const messages = [
  `${TITLE_AI}: 嗨！我可以怎麼幫助你？`,
  `${TITLE_HUMAN}: 請詳細解釋圓周率。`,
];

const context = messages.map((m) => `${m}\n`).join('');

const res = await chat({ context });

console.log(res);
