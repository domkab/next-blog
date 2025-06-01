'use client';

import { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import axios from 'axios';

type SecuredImageProps = Omit<ImageProps, 'src'> & {
  path: string;
  alt: string;
};

const signedUrlCache = new Map<string, string>();

export default function SecuredImage({ path, alt, ...props }: SecuredImageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;

    if (signedUrlCache.has(path)) {
      setSignedUrl(signedUrlCache.get(path)!);
      return;
    }

    const fetchSignedUrl = async () => {
      try {
        const res = await axios.get('/api/image/image-url', {
          params: { path },
        });

        if (res.data?.url) {
          signedUrlCache.set(path, res.data.url);
          setSignedUrl(res.data.url);
        }
      } catch (err) {
        console.error('Failed to get signed image URL:', err);
      }
    };

    fetchSignedUrl();
  }, [path]);

  if (!signedUrl) return null;

  return <Image src={signedUrl} alt={alt} {...props} />;
}