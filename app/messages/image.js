import { MESSAGE_TYPE_IMAGE } from '../../services/line.js';

class Image {
  type;

  originalContentUrl;

  previewImageUrl;

  constructor({
    originalContentUrl,
    previewImageUrl,
  }) {
    this.type = MESSAGE_TYPE_IMAGE;
    this.originalContentUrl = originalContentUrl;
    this.previewImageUrl = previewImageUrl;
  }
}

export default Image;
