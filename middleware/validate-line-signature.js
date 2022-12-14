import config from '../config/index.js';
import {
  validateSignature,
} from '../utils/index.js';

const validateLineSignature = (req, res, next) => {
  const { rawBody } = req;
  const signature = req.header('x-line-signature');
  if (config.LINE_API_SECRET && !validateSignature(rawBody, config.LINE_API_SECRET, signature)) {
    res.sendStatus(403);
    return;
  }
  next();
};

export default validateLineSignature;
