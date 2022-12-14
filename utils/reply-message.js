import {
  MESSAGE_TYPE_TEXT,
  replyMessages,
} from '../services/line/index.js';

const replyMessage = ({
  replyToken,
  text,
}) => replyMessages({
  replyToken,
  messages: [
    {
      type: MESSAGE_TYPE_TEXT,
      text,
    },
  ],
});

export default replyMessage;
