import React, { useState, useEffect } from "react";
import baiGiangAPI from "../../../../services/apis/baiGiangAPI";

// 🚀 1. Khai báo kiểu dữ liệu cho các Props truyền vào
interface FormBaiGiangProps {
  classId?: string | number;
  initialData?: any;
  onSuccess?: () => void;
}

export default function FormBaiGiang({
  classId,
  initialData,
  onSuccess,
}: FormBaiGiangProps) {
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [tenTaiLieu, setTenTaiLieu] = useState("");
  const [linkTaiLieu, setLinkTaiLieu] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTieuDe(initialData.tieuDe || "");
      setNoiDung(initialData.noiDung || "");
      setTenTaiLieu(initialData.tenTaiLieu || "");
      setLinkTaiLieu(initialData.linkTaiLieu || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Bật trạng thái đang gửi

    // 🚀 Lấy thông tin Giáo viên từ Local Storage
    const userString = localStorage.getItem("user");
    let currentUserId = null;

    if (userString) {
      try {
        const currentUser = JSON.parse(userString);
        currentUserId = currentUser.id;
      } catch (err) {
        console.error("Lỗi đọc Local Storage", err);
      }
    }

    if (!currentUserId) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      setIsSubmitting(false);
      return;
    }

    // 🚀 Đóng gói gói hàng y xì form Java yêu cầu
    const payload = {
      tieuDe: tieuDe,
      noiDung: noiDung,
      idGiaoVien: currentUserId,
      danhSachIdLopHoc: [Number(classId)],

      danhSachFile: linkTaiLieu
        ? [
            {
              tenFile: tenTaiLieu || "Tài liệu đính kèm",
              urlFile: linkTaiLieu,
              loaiFile: "url",
            },
          ]
        : [],
    };

    try {
      // KIỂM TRA: Nếu có initialData thì là ĐANG SỬA, nếu không thì là TẠO MỚI
      if (initialData) {
        await baiGiangAPI.update(initialData.id, payload);
        alert("Cập nhật bài giảng thành công!");
      } else {
        await baiGiangAPI.create(payload);
        alert("Tạo bài giảng mới thành công!");
      }

      // Thành công thì gọi hàm đóng form (onSuccess)
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Lỗi lưu bài giảng:", error);
      alert("Có lỗi xảy ra, vui lòng mở F12 xem chi tiết!");
    } finally {
      setIsSubmitting(false); // Tắt trạng thái đang gửi
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TIÊU ĐỀ */}
      <div>
        <label className="block font-bold mb-1">
          Tiêu đề: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Nhập tiêu đề bài giảng..."
        />
      </div>

      {/* NỘI DUNG */}
      <div>
        <label className="block font-bold mb-1">Nội dung:</label>
        <textarea
          rows={4}
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Nhập nội dung mô tả..."
        ></textarea>
      </div>

      {/* ĐÍNH KÈM TÀI LIỆU */}
      <div className="border border-dashed border-gray-400 p-4 rounded bg-gray-50">
        <label className="block font-bold mb-2 text-gray-700">
          📎 Đính kèm tài liệu (Không bắt buộc)
        </label>

        <div className="mb-3">
          <label className="block text-sm mb-1">Tên tài liệu:</label>
          <input
            type="text"
            value={tenTaiLieu}
            onChange={(e) => setTenTaiLieu(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            placeholder="VD: Slide Bài 1, Tài liệu ôn tập Word..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Đường dẫn (Link Google Drive, OneDrive...):
          </label>
          <input
            type="url"
            value={linkTaiLieu}
            onChange={(e) => setLinkTaiLieu(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Dán link tài liệu vào đây..."
          />
        </div>
      </div>

      {/* NÚT LƯU */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 disabled:bg-gray-400 mt-4 transition duration-200"
      >
        {isSubmitting ? "ĐANG LƯU..." : "🚀 LƯU BÀI GIẢNG"}
      </button>
    </form>
  );
}
