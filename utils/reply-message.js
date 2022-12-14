import {
  MESSAGE_TYPE_TEXT,
  replyMessages,
} from '../services/line/index.js';

const replyMessage = ({
  replyToken,
  replies,
}) => replyMessages({
  replyToken,
  messages: replies.map((reply) => ({
    type: MESSAGE_TYPE_TEXT,
    text: reply,
  })),
});

export default replyMessage;
