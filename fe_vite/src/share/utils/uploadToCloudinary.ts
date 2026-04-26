// =============================================================
// CẤU HÌNH CLOUDINARY
// 1. Tạo tài khoản tại cloudinary.com (free tier đủ dùng)
// 2. Vào Settings > Upload > Add upload preset
//    - Signing mode: Unsigned
//    - Folder: exam-images (tuỳ chọn)
// 3. Điền CLOUD_NAME và UPLOAD_PRESET bên dưới
// =============================================================

const CLOUD_NAME = "dovvpek9r"; // vd: "dxyz123abc"
const UPLOAD_PRESET = "exam_unsigned"; // vd: "exam_unsigned"

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export class CloudinaryUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryUploadError";
  }
}

/**
 * Upload một file ảnh lên Cloudinary và trả về secure_url
 * Sử dụng unsigned upload preset (không cần API key trên client)
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new CloudinaryUploadError("Chỉ hỗ trợ file ảnh.");
  }

  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new CloudinaryUploadError(
      `Ảnh quá lớn. Tối đa ${MAX_SIZE_MB}MB.`,
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Dùng XMLHttpRequest để track progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          secure_url: data.secure_url,
          public_id: data.public_id,
          width: data.width,
          height: data.height,
        });
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(
          new CloudinaryUploadError(
            err?.error?.message ?? "Upload thất bại.",
          ),
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new CloudinaryUploadError("Lỗi mạng khi upload ảnh."));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    );
    xhr.send(formData);
  });
}
