import Bot from './bot.js';

class Source {
  type;

  bot;

  createdAt;

  constructor({
    type,
    isActivated,
  }) {
    this.type = type;
    this.bot = new Bot({
      isActivated,
    });
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}

export default Source;
