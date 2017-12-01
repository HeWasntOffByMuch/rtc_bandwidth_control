import db from './db';
import { updateMedia, loadMedia } from './media';

class SharableElement extends HTMLElement {
  async loadBlob() {
    this.blob = await loadMedia(this.hash)
  }

  get src() {
    return this.getAttribute('src');
  }

  get hash() {
    return this.getAttribute('hash');
  }

  get remote() {
    return this.hasAttribute('remote');
  }

  set blob(value) {
    return false;
  }
}

class SharableImage extends SharableElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const img = this.img = document.createElement('img');
    if (this.remote) {
      this.loadBlob();
    } else {
      img.src = this.src;
      updateMedia({ hash: this.hash, src: this.src });
    }

    shadow.appendChild(img);
  }

  set blob(value) {
    this.img.src = URL.createObjectURL(value);
    return true;
  }
}

customElements.define('sharable-img', SharableImage);
