import config from '../config/index.js';
import {
  MESSAGE_TYPE_TEXT,
  replyMessages,
} from '../services/line/index.js';

const replyMessage = ({
  replyToken,
  replies,
}) => {
  if (config.APP_ENV === 'production' && replies.length > 0) {
    return replyMessages({
      replyToken,
      messages: replies.map((reply) => ({
        type: MESSAGE_TYPE_TEXT,
        text: reply,
      })),
    });
  }
  return {
    replyToken,
    replies,
  };
};

export default replyMessage;
