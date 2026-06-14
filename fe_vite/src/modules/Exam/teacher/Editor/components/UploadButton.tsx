// import { Upload } from "lucide-react";
// import { useRef } from "react";

// interface UploadButtonProps {
//   onUpload: (file: File) => void;
// }

// const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleClick = () => {
//     inputRef.current?.click();
//   };

//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // If it's a .docx file, extract text using mammoth
//       if (file.name.endsWith(".docx")) {
//         try {
//           const mammoth = await import("mammoth");
//           const arrayBuffer = await file.arrayBuffer();
//           const result = await mammoth.extractRawText({ arrayBuffer });
//           onUpload(
//             new File([result.value], file.name + ".txt", {
//               type: "text/plain",
//             }),
//           );
//         } catch {
//           alert("Failed to read Word file. Please try again.");
//         }
//       } else {
//         onUpload(file);
//       }
//       e.target.value = ""; // reset input
//     }
//   };

//   return (
//     <div
//       className="flex items-center gap-2 border-r border-gray-200 p-2.5 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-darkmode-100"
//       onClick={handleClick}
//     >
//       <Upload
//         className="size-5 text-gray-700 dark:text-slate-300"
//         strokeWidth={1.5}
//       />
//       <div className="text-[13px]">Upload File</div>
//       <input
//         ref={inputRef}
//         type="file"
//         accept=".txt,.docx"
//         style={{ display: "none" }}
//         onChange={handleChange}
//       />
//     </div>
//   );
// };

// export default UploadButton;

import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import {
  uploadToCloudinary,
  CloudinaryUploadError,
} from "../../../../../share/utils/uploadToCloudinary";

interface UploadButtonProps {
  onUpload: (file: File) => void;
  onInsertImageTag?: (tag: string) => void; // callback riêng cho ảnh
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUpload,
  onInsertImageTag,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ── Upload file .txt / .docx (giữ nguyên logic cũ) ─────────
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".docx")) {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onUpload(
          new File([result.value], file.name + ".txt", { type: "text/plain" }),
        );
      } catch {
        alert("Failed to read Word file. Please try again.");
      }
    } else {
      onUpload(file);
    }
    e.target.value = "";
  };

  // ── Upload ảnh lên Cloudinary ───────────────────────────────
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
    e.target.value = "";
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const result = await uploadToCloudinary(file, setProgress);
      const tag = `[img:$${result.secure_url}$]`;
      onInsertImageTag?.(tag);
    } catch (err) {
      if (err instanceof CloudinaryUploadError) {
        setError(err.message);
      } else {
        setError("Upload thất bại. Vui lòng thử lại.");
      }
      // Tự ẩn lỗi sau 3 giây
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* ── Upload txt/docx (cũ) ── */}
      <div
        className="flex items-center gap-2 border-r border-gray-200 p-2.5 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-darkmode-100"
        onClick={handleClick}
      >
        <Upload
          className="size-5 text-gray-700 dark:text-slate-300"
          strokeWidth={1.5}
        />
        <div className="text-[13px]">Upload File</div>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.docx"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      {/* ── Upload ảnh lên Cloudinary ── */}
      <div
        className={`relative flex items-center gap-2 border-r border-gray-200 p-2.5 select-none
          ${uploading ? "cursor-wait opacity-70" : "hover:cursor-pointer hover:bg-gray-100"}`}
        onClick={!uploading ? handleImageClick : undefined}
        title="Chèn ảnh (upload lên Cloudinary)"
      >
        {uploading ? (
          <>
            <Loader2
              className="size-5 animate-spin text-blue-600"
              strokeWidth={1.5}
            />
            <div className="text-[13px] text-blue-600">
              {progress > 0 ? `${progress}%` : "Đang tải..."}
            </div>
          </>
        ) : (
          <>
            <ImageIcon
              className="size-5 text-gray-700 dark:text-slate-300"
              strokeWidth={1.5}
            />
            <div className="text-[13px]">Chèn ảnh</div>
          </>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>

      {/* ── Toast lỗi ── */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 shadow-md">
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </>
  );
};

export default UploadButton;
