import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import FormBaiGiang from "./CreateLecture";

import baiGiangAPI from "../../../../services/apis/baiGiangAPI";
export default function QuanLyBaiGiang() {
  const { id } = useParams();

  const [danhSachBaiGiang, setDanhSachBaiGiang] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baiGiangDangSua, setBaiGiangDangSua] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadDanhSach();
    }
  }, [id]);

  const loadDanhSach = async () => {
    try {
      const res = await baiGiangAPI.getByClassId(id as string);

      // BẬT TÍNH NĂNG SOI DATA: Mở F12 -> Console xem dòng này in ra cái gì
      console.log("===> DỮ LIỆU TỪ JAVA TRẢ VỀ:", res.data);

      setDanhSachBaiGiang(res.data);
    } catch (error) {
      console.error("Lỗi tải bài giảng", error);
    }
  };

  const handleMoFormThemMoi = () => {
    setBaiGiangDangSua(null);
    setIsModalOpen(true);
  };

  const handleMoFormSua = (baiGiang: any) => {
    setBaiGiangDangSua(baiGiang);
    setIsModalOpen(true);
  };

  const handleXoa = async (baiGiangId: number) => {
    if (window.confirm("Thầy/Cô có chắc chắn muốn xóa bài giảng này?")) {
      try {
        await baiGiangAPI.delete(baiGiangId);
        loadDanhSach();
        alert("Đã xóa bài giảng thành công!");
      } catch (error) {
        alert("Lỗi không thể xóa bài giảng!");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách bài giảng
        </h2>
        <button
          onClick={handleMoFormThemMoi}
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded hover:bg-blue-700 transition duration-200 shadow-md"
        >
          + Tạo bài giảng mới
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-200">
        {danhSachBaiGiang.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              Chưa có bài giảng nào trong lớp này.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Hãy bấm "Tạo bài giảng mới" để bắt đầu!
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-gray-600">
                <th className="py-3 px-2">Tiêu đề</th>
                <th className="py-3 px-2">Ngày tạo</th>
                <th className="py-3 px-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {danhSachBaiGiang.map((bg: any, index: number) => (
                <tr
                  key={bg.id || index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-150"
                >
                  {/* 🚀 ĐÂY LÀ PHẦN "BAO LÔ": Kiểu gì cũng phải moi được cái tên ra hiển thị */}
                  <td className="py-3 px-2 font-medium text-blue-600">
                    {bg.tieuDe ||
                      bg.title ||
                      bg.name ||
                      "Bài giảng chưa có tiêu đề"}
                  </td>

                  <td className="py-3 px-2 text-gray-500">
                    {bg.createdAt || "Hôm nay"}
                  </td>

                  <td className="py-3 px-2 space-x-4 text-center">
                    <button
                      onClick={() => handleMoFormSua(bg)}
                      className="text-blue-500 hover:text-blue-700 font-medium hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleXoa(bg.id)}
                      className="text-red-500 hover:text-red-700 font-medium hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition duration-200"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
              {baiGiangDangSua ? "📝 Sửa bài giảng" : "✨ Tạo bài giảng mới"}
            </h3>

            <FormBaiGiang
              classId={id}
              initialData={baiGiangDangSua}
              onSuccess={() => {
                setIsModalOpen(false);
                loadDanhSach();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
