/* eslint-disable @typescript-eslint/no-explicit-any */
/* @ts-nocheck */
import ReactQuill from 'react-quill-new';

const Quill = (ReactQuill as any).Quill;
const BlockEmbed = Quill.import('blots/block/embed') as any;

export interface CustomImageValue {
  id: string;
  url: string;
}

export class CustomImageBlot extends BlockEmbed {
  static blotName = 'customImage';
  static tagName = 'img';

  static create(value: CustomImageValue): HTMLElement {
    const node = super.create() as HTMLElement;
    node.setAttribute('src', value.url);
    node.setAttribute('data-image-id', value.id);
    node.setAttribute('alt', 'inline image');
    node.classList.add('ql-custom-image');
    return node;
  }

  static value(domNode: HTMLElement): CustomImageValue {
    return {
      id: domNode.getAttribute('data-image-id') ?? '',
      url: domNode.getAttribute('src') ?? '',
    };
  }
}

export default CustomImageBlot;