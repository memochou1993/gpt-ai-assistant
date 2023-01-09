class Source {
  type;

  bot;

  createdAt;

  constructor({
    type,
  }) {
    this.type = type;
    this.bot = {
      isActivated: true,
    };
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}

export default Source;
