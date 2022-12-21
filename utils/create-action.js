import { ACTION_TYPE_MESSAGE, QUICK_REPLY_TYPE_ACTION } from '../services/line.js';
import capitalize from './capitalize.js';

class Action {
  type;

  action;

  constructor({
    label,
    text,
  }) {
    this.type = QUICK_REPLY_TYPE_ACTION;
    this.action = {
      type: ACTION_TYPE_MESSAGE,
      label,
      text,
    };
  }
}

/**
 * @param {string} action
 */
const createAction = (action) => new Action({
  label: capitalize(action),
  text: capitalize(action),
});

export default createAction;
