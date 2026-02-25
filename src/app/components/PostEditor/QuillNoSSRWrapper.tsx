import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';
import type ReactQuillType from 'react-quill-new';
import type ReactQuillProps from 'react-quill-new';

const QuillNoSSRWrapper = dynamic(() =>
  import('react-quill-new').then(async mod => {
    const ReactQuill = mod.default;

    function QuillInner(
      props: ReactQuillProps,
      ref: React.ForwardedRef<ReactQuillType>,
    ) {
      return <ReactQuill {...props} ref={ref} />;
    }

    return forwardRef<ReactQuillType, ReactQuillProps>(QuillInner);
  }),
  { ssr: false },
) as unknown as React.ForwardRefExoticComponent<
  ReactQuillProps & React.RefAttributes<ReactQuillType>
>;

export default QuillNoSSRWrapper;
