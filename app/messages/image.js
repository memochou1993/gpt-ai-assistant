import { MESSAGE_TYPE_IMAGE } from '../../services/line.js';
import Message from './message.js';

class Image extends Message {
  type;

  originalContentUrl;

  previewImageUrl;

  constructor({
    originalContentUrl,
    previewImageUrl,
  }) {
    super();
    this.type = MESSAGE_TYPE_IMAGE;
    this.originalContentUrl = originalContentUrl;
    this.previewImageUrl = previewImageUrl;
  }
}

export default Image;
