import {
  validate,
} from '../utils/index.js';

const validateSignature = (secret) => (req, res, next) => {
  const signature = req.header('x-line-signature');
  if (secret && !validate(req.rawBody, secret, signature)) {
    res.sendStatus(403);
    return;
  }
  next();
};

export default validateSignature;
