import { ACTION_TYPE_MESSAGE } from '../../services/line.js';

class Action {
  type;

  constructor() {
    this.type = ACTION_TYPE_MESSAGE;
  }
}

export default Action;
