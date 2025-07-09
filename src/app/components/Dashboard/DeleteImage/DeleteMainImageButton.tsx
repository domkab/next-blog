'use client';

import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Modal } from 'flowbite-react';

export function DeleteMainImageButton({
  slug, onSuccess
}: {
  slug: string, onSuccess?: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${slug}/delete-main-image`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete image');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('❌ Error deleting main image');
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleDelete();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        title="Delete main image"
        className="p-1 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiX className="h-5 w-5 text-red-600 hover:text-red-800" />
      </button>

      {/* 🧼 Modal */}
      <Modal show={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header className="text-lg font-semibold text-gray-800 dark:text-gray-300">
          Delete Main Image
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete the main image? This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-center items-center'>
          <button

            onClick={handleDelete}
            disabled={isDeleting}
            className=" bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}