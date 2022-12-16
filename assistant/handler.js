import Base from './commands/base';

class Handler {
  constructor(event) {
    this.event = event;
  }

  /**
   * @param {Base} command
   * @returns {Handler}
   */
  use(command) {
    command.handleEvent(this.event);
    return this;
  }
}

export default Handler;
