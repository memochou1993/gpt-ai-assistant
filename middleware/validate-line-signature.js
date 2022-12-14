import {
  LINE_API_SECRET,
} from '../config/index.js';
import {
  validateSignature,
} from '../utils/index.js';

const validateLineSignature = (req, res, next) => {
  const signature = req.header('x-line-signature');
  if (LINE_API_SECRET && !validateSignature(req.rawBody, LINE_API_SECRET, signature)) {
    res.sendStatus(403);
    return;
  }
  next();
};

export default validateLineSignature;
