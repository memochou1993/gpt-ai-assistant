import Bot from './bot.js';

class Source {
  type;

  name;

  bot;

  createdAt;

  constructor({
    type,
    name,
    isActivated,
  }) {
    this.type = type;
    this.name = name;
    this.bot = new Bot({
      isActivated,
    });
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}

export default Source;
