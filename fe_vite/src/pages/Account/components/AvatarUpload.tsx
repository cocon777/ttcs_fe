import { Camera } from "lucide-react";
import { useRef } from "react";

interface AvatarUploadProps {
  avatarUrl: string | null;
  existingAvatar: string | null | undefined;
  initial: string;
  uploading: boolean;
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload = ({
  avatarUrl,
  existingAvatar,
  initial,
  uploading,
  uploadProgress,
  onFileChange,
}: AvatarUploadProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const displayUrl = avatarUrl || existingAvatar;

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        {displayUrl ? (
          <img
            src={displayUrl}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white ring-4 ring-slate-100 dark:ring-slate-800">
            {initial}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <span className="text-xs font-bold text-white">
              {uploadProgress}%
            </span>
          </div>
        )}

        <button
          onClick={() => !uploading && fileRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow hover:bg-slate-50 disabled:opacity-50"
        >
          <Camera className="size-3.5 text-slate-500" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Tải lên ảnh đại diện
        </p>
        <p className="text-xs text-slate-400">Tối đa 10MB · JPG, PNG, WEBP</p>
        {uploading && (
          <div className="mt-1.5 h-1.5 w-36 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
