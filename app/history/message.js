class Message {
  role;

  content;

  constructor({
    role,
    content,
  }) {
    this.role = role;
    this.content = content;
  }

  toString() {
    return `${this.role}: ${this.content}`;
  }
}

export default Message;
