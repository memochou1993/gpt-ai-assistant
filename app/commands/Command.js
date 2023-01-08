class Command {
  type;

  label;

  text;

  prompt;

  aliases;

  constructor({
    type,
    label,
    text,
    prompt,
    aliases,
  }) {
    this.type = type;
    this.label = label;
    this.text = text;
    this.prompt = prompt;
    this.aliases = aliases;
  }
}

export default Command;
