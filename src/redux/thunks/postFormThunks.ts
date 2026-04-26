import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setImageUploadProgress,
  setImageUploadError,
  setFormData,
} from "../slices/postFormSlice";
import { generateSlug } from "@/utils/generateSlug";
import { RootState } from "../store";
import { uploadImageViaApi } from "@/firebase/uploadImageViaApi";

export interface UploadImageResult {
  url: string;
  storagePath: string;
  provider: "firebase";
}

interface UploadImageResponse extends UploadImageResult {
  target: "main" | "inline";
}

export const uploadPostImage = createAsyncThunk<
  UploadImageResponse,
  { file: File; target: "main" | "inline" },
  { state: RootState }
>(
  "postForm/uploadPostImage",
  async ({ file, target }, { dispatch, getState, rejectWithValue }) => {
    dispatch(setImageUploadProgress("0"));
    dispatch(setImageUploadError(null));

    const state = getState();
    const { title, slug: currentSlug } = state.postForm;

    const slug = currentSlug || generateSlug(title);

    if (!currentSlug) {
      dispatch(setFormData({ slug }));
    }

    try {
      return await new Promise<UploadImageResponse>((resolve, reject) => {
        uploadImageViaApi(
          file,
          target,
          slug,
          (progress: string) => {
            dispatch(setImageUploadProgress(progress));
          },
          (error: string) => {
            dispatch(setImageUploadProgress(null));
            dispatch(setImageUploadError(error));
            reject(new Error(error));
          },
          (result: UploadImageResult) => {
            dispatch(setImageUploadProgress(null));

            resolve({
              ...result,
              target,
            });
          },
        );
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      dispatch(setImageUploadProgress(null));
      dispatch(setImageUploadError(errorMessage));
      console.error("Error uploading image:", error);

      return rejectWithValue(errorMessage);
    }
  },
);
