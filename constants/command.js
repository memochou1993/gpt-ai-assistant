class Command {
  label;

  text;

  constructor({
    label,
    text,
  }) {
    this.label = label;
    this.text = text;
  }
}

export const COMMAND_AI = new Command({
  text: 'ai',
});

export const COMMAND_CHAT = new Command({
  text: 'chat',
});

export const COMMAND_DRAW = new Command({
  text: 'draw',
});

export const COMMAND_SETTINGS = new Command({
  label: 'Settings',
  text: 'settings',
});

export const COMMAND_VERSION = new Command({
  label: 'Version',
  text: 'version',
});

export const COMMAND_DEPLOY = new Command({
  label: 'Deploy',
  text: 'deploy',
});

export const COMMAND_DISABLE_AUTO_REPLY = new Command({
  label: 'Disable Auto Reply',
  text: 'disable-auto-reply',
});

export const COMMAND_ENABLE_AUTO_REPLY = new Command({
  label: 'Enable Auto Reply',
  text: 'enable-auto-reply',
});

export const COMMAND_CONTINUE = new Command({
  label: 'Continue',
  text: 'continue',
});

export default Command;
