class Command {
  type;

  label;

  text;

  reply;

  prompt;

  aliases;

  constructor({
    type,
    label,
    text,
    reply = '',
    prompt = '',
    aliases = [],
  }) {
    this.type = type;
    this.label = label;
    this.text = text;
    this.reply = reply;
    this.prompt = prompt;
    this.aliases = aliases;
  }
}

export default Command;
