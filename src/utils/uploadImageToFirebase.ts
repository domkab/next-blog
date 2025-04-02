import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';

export async function uploadImageToFirebase(
  file: File,
  target: 'main' | 'inline',
  slug: string,
  onProgress: (progress: string) => void,
  onError: (error: string) => void,
  onSuccess: (url: string) => void
) {
  try {
    const storage = getStorage(app);
    const folderPath = `posts/${slug}`;
    const prefix = target === 'main' ? 'main' : 'inline';
    const fileName = `${prefix}-${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, `${folderPath}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress.toFixed(0));
      },
      (error) => {
        onError(`Image upload failed: ${error}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onSuccess(downloadURL);
        });
      }
    );
  } catch (error) {
    onError('Image upload failed');
    console.error(error);
  }
}