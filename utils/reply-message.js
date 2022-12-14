import {
  MESSAGE_TYPE_TEXT,
  replyMessages,
} from '../services/line/index.js';

const replyMessage = ({
  replyToken,
  replies,
}) => replies.length > 0 && replyMessages({
  replyToken,
  messages: replies.map((reply) => ({
    type: MESSAGE_TYPE_TEXT,
    text: reply,
  })),
});

export default replyMessage;
