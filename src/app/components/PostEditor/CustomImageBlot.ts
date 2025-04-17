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
    expanded?: boolean;
  }) {
    const node = super.create();
    node.classList.add('custom-image-container');

    // Create the image element.
    const image = document.createElement('img');
    image.setAttribute('src', value.url);
    image.classList.add('custom-image');
    node.appendChild(image);

    // Create metadata container.
    const metaContainer = document.createElement('div');
    metaContainer.classList.add('image-meta');
    // Initially, hide the metadata container (if not expanded).
    if (!value.expanded) {
      metaContainer.style.display = 'none';
    }

    // Populate metadata if provided.
    if (value.meta) {
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
    }
    node.appendChild(metaContainer);

    // Create a toggle button for showing/hiding metadata.
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Edit metadata';
    toggleBtn.classList.add('meta-toggle-btn');
    toggleBtn.onclick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      // Toggle the display style.
      if (metaContainer.style.display === 'none') {
        metaContainer.style.display = 'block';
        toggleBtn.textContent = 'Hide metadata';
      } else {
        metaContainer.style.display = 'none';
        toggleBtn.textContent = 'Edit metadata';
      }
    };
    node.appendChild(toggleBtn);

    return node;
  }

  static value(node: HTMLElement) {
    const image = node.querySelector('img');
    const metaContainer = node.querySelector('.image-meta');
    const meta: any = {};
    if (metaContainer) {
      // You can later change how to read metadata (e.g., read from input fields)
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