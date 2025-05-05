/* eslint-disable @next/next/no-img-element */
'use client';

import React, { ChangeEvent, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import {
  updateInlineImageMeta,
  removeInlineImage,
  ImageMeta,
} from '@/redux/slices/postFormSlice';

import styles from './InlineImageEditor.module.scss';

const InlineImageEditor: React.FC = () => {
  const dispatch = useDispatch();
  const inlineImages = useSelector(
    (state: RootState) => state.postForm.images.inline,
  );

  const handleMetaChange = (
    id: string,
    field: keyof ImageMeta,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      updateInlineImageMeta({
        id,
        meta: { [field]: e.target.value },
      }),
    );
  };

  return (
    <section className={styles['inline-img-editor']}>
      {inlineImages.length === 0 && (
        <p className={styles['inline-img-editor__empty']}>
          No inline images yet.
        </p>
      )}

      {inlineImages.map(({ id, url, meta }) => (
        <article key={id} className={styles['inline-img-editor__item']}>
          <img
            src={url}
            alt={meta?.description ?? `inline image ${id}`}
            className={styles['inline-img-editor__thumb']}
          />

          <div className={styles['inline-img-editor__fields']}>
            <label className={styles['inline-img-editor__label']}>
              Author
              <input
                type="text"
                value={meta?.author ?? ''}
                onChange={e => handleMetaChange(id, 'author', e)}
                className={styles['inline-img-editor__input']}
              />
            </label>

            <label className={styles['inline-img-editor__label']}>
              Description
              <input
                type="text"
                value={meta?.description ?? ''}
                onChange={e => handleMetaChange(id, 'description', e)}
                className={styles['inline-img-editor__input']}
              />
            </label>

            <button
              type="button"
              className={styles['inline-img-editor__delete']}
              onClick={() => dispatch(removeInlineImage(id))}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};

export default memo(InlineImageEditor);