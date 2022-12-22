import { MESSAGE_TYPE_TEMPLATE, TEMPLATE_TYPE_BUTTONS } from '../../services/line.js';
import Message from './message.js';

class Template extends Message {
  type;

  altText;

  template;

  constructor({
    text,
    buttons,
  }) {
    super();
    this.type = MESSAGE_TYPE_TEMPLATE;
    this.altText = text;
    this.template = {
      type: TEMPLATE_TYPE_BUTTONS,
      text,
      buttons,
    };
  }
}

export default Template;
