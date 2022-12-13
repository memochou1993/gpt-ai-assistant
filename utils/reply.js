import {
  MESSAGE_TYPE_TEXT,
  replyMessage,
} from '../services/line.js';

const reply = ({
  replyToken,
  text,
}) => replyMessage({
  replyToken,
  messages: [
    {
      type: MESSAGE_TYPE_TEXT,
      text,
    },
  ],
});

export default reply;
