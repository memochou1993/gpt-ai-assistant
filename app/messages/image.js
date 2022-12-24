import { MESSAGE_TYPE_IMAGE } from '../../services/line.js';
import Message from './message.js';

class ImageMessage extends Message {
  type = MESSAGE_TYPE_IMAGE;

  originalContentUrl;

  previewImageUrl;

  constructor({
    originalContentUrl,
    previewImageUrl,
  }) {
    super();
    this.originalContentUrl = originalContentUrl;
    this.previewImageUrl = previewImageUrl;
  }
}

export default ImageMessage;
