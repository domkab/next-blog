/* eslint-disable @typescript-eslint/no-explicit-any */

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as any;

class CustomImageBlot extends BlockEmbed {
  static blotName = 'customImage';
  static tagName = 'div';
  static className = 'custom-image-blot';

  static create(value: {
    url: string;
    meta?: { author?: string; link?: string; license?: string };
  }) {
    const node = super.create();
    node.classList.add('custom-image-container');
    const image = document.createElement('img');
    image.setAttribute('src', value.url);
    image.classList.add('custom-image');
    node.appendChild(image);

    if (value.meta) {
      const metaContainer = document.createElement('div');
      metaContainer.classList.add('image-meta');

      if (value.meta.author) {
        const authorSpan = document.createElement('span');
        authorSpan.textContent = `Author: ${value.meta.author}`;
        metaContainer.appendChild(authorSpan);
      }
      if (value.meta.link) {
        const linkAnchor = document.createElement('a');
        linkAnchor.href = value.meta.link;
        linkAnchor.textContent = 'Source';
        metaContainer.appendChild(linkAnchor);
      }
      if (value.meta.license) {
        const licenseSpan = document.createElement('span');
        licenseSpan.textContent = `License: ${value.meta.license}`;
        metaContainer.appendChild(licenseSpan);
      }

      node.appendChild(metaContainer);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('custom-image-delete');
    deleteBtn.onclick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const quillInstance = Quill.find(node);
      if (
        quillInstance &&
        typeof (quillInstance as any).getIndex === 'function' &&
        typeof (quillInstance as any).deleteText === 'function'
      ) {
        const index = (quillInstance as any).getIndex(node);
        (quillInstance as any).deleteText(index, 1);
      }
    };
    node.appendChild(deleteBtn);

    return node;
  }

  static value(node: HTMLElement) {
    const image = node.querySelector('img');
    const metaContainer = node.querySelector('.image-meta');
    const meta: any = {};
    if (metaContainer) {
      const authorSpan = metaContainer.querySelector('span');
      const linkAnchor = metaContainer.querySelector('a');
      const licenseSpan = metaContainer.querySelector('span:last-child');
      if (authorSpan) {
        meta.author = authorSpan.textContent?.replace('Author: ', '');
      }
      if (linkAnchor) {
        meta.link = linkAnchor.getAttribute('href');
      }
      if (licenseSpan) {
        meta.license = licenseSpan.textContent?.replace('License: ', '');
      }
    }
    return {
      url: image ? image.getAttribute('src') : '',
      meta,
    };
  }
}

export default CustomImageBlot;