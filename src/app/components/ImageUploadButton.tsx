import { FileInput, Button } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';

interface ImageUploadButtonProps {
  onFileChange: (file: File | null) => void;
  onUploadClick: () => void;
  uploadProgress?: number;
  disabled?: boolean;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = (
  {
    onFileChange,
    onUploadClick,
    uploadProgress,
    disabled
  }
) => (
  <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
    <FileInput accept="image/*" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} />
    <Button
      type="button"
      gradientDuoTone="purpleToBlue"
      size="sm"
      outline
      onClick={onUploadClick}
      disabled={disabled}
    >
      {uploadProgress !== undefined ? (
        <div className="w-16 h-16">
          <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} />
        </div>
      ) : (
        'Upload Image'
      )}
    </Button>
  </div>
);

export default ImageUploadButton;