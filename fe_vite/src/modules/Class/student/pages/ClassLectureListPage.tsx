import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 🚀 Nhớ sửa lại đường dẫn import API cho chuẩn với project của ông nhé
import { baiGiangAPI } from '../../../../services/apis/baiGiangAPI'; 

export default function ClassLectureListPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [danhSachBaiGiang, setDanhSachBaiGiang] = useState<any[]>([]);
  // Biến này để nhớ xem học sinh đang bấm mở bài giảng nào
  const [baiGiangDangMo, setBaiGiangDangMo] = useState<number | null>(null);

  useEffect(() => {
    if (classId) {
      loadDanhSach();
    }
  }, [classId]);

  const loadDanhSach = async () => {
    try {
        const res = await baiGiangAPI.getByClassId(classId as string);
        setDanhSachBaiGiang(res.data);
    } catch (error) {
        console.error("Lỗi tải bài giảng", error);
    }
  };

  // Hàm xử lý khi học sinh bấm vào tiêu đề bài giảng
  const toggleMoBaiGiang = (id: number) => {
    if (baiGiangDangMo === id) {
        setBaiGiangDangMo(null); // Nếu đang mở thì đóng lại
    } else {
        setBaiGiangDangMo(id); // Nếu đang đóng thì mở ra
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button 
           onClick={() => navigate(-1)} 
           className="mb-4 text-blue-600 hover:underline font-medium"
        >
           ← Quay lại lớp học
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">📚 Danh sách bài giảng</h2>

        {danhSachBaiGiang.length === 0 ? (
           <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500 text-lg">Thầy cô chưa giao bài giảng nào cho lớp này.</p>
           </div>
        ) : (
           <div className="space-y-4">
              {danhSachBaiGiang.map((bg: any, index: number) => (
                 <div key={bg.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* PHẦN TIÊU ĐỀ (Bấm vào đây để mở rộng) */}
                    <div 
                       onClick={() => toggleMoBaiGiang(bg.id || index)}
                       className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center transition-colors"
                    >
                       <h3 className="text-xl font-semibold text-blue-700">
                           {bg.tieuDe || bg.title || `Bài giảng ${index + 1}`}
                       </h3>
                       <span className="text-gray-400">
                           {baiGiangDangMo === (bg.id || index) ? "▲ Thu gọn" : "▼ Xem nội dung"}
                       </span>
                    </div>

                    {/* PHẦN NỘI DUNG BÊN TRONG (Chỉ hiện khi baiGiangDangMo khớp với ID) */}
                    {baiGiangDangMo === (bg.id || index) && (
                       <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                          <p className="text-gray-700 whitespace-pre-wrap mb-4">
                              {bg.noiDung || "Không có nội dung mô tả."}
                          </p>

                          {/* 🚀 ĐÂY LÀ PHẦN HIỂN THỊ LINK TÀI LIỆU */}
                          {/* 🚀 ĐÂY LÀ PHẦN "BAO VÂY" TÀI LIỆU CẢ Ở DẠNG MẢNG LẪN DẠNG LẺ */}

                          {/* Trường hợp 1: Java trả về một mảng danh sách file (Chuẩn nhất) */}
                          {(bg.danhSachFile || bg.fileBaiGiangs) && (bg.danhSachFile || bg.fileBaiGiangs).length > 0 ? (
                              <div className="mt-4 flex flex-col gap-2">
                                  <span className="font-semibold text-gray-700">📎 Tài liệu đính kèm:</span>
                                  {(bg.danhSachFile || bg.fileBaiGiangs).map((file: any, i: number) => (
                                      <a 
                                          key={i}
                                          // 🚀 Đã sửa thành file.duongDan cho khớp với Java Entity
                                          href={file.duongDan || file.urlFile} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline bg-blue-50 border border-blue-100 rounded p-2 w-fit"
                                      >
                                          {/* 🚀 Đã sửa thành file.tieuDe cho khớp với Java Entity */}
                                          {file.tieuDe || "Tài liệu " + (i + 1)}
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                      </a>
                                  ))}
                              </div>
                          ) : (
                              /* Trường hợp 2: Java vẫn trả về thuộc tính nằm bên ngoài (Đề phòng) */
                              (bg.linkTaiLieu || bg.urlFile || bg.link) && (
                                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded inline-block">
                                      <span className="font-semibold text-gray-700 mr-2">📎 Tài liệu đính kèm:</span>
                                      <a 
                                          href={bg.linkTaiLieu || bg.urlFile || bg.link} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                                      >
                                          {bg.tenTaiLieu || bg.tenFile || "Nhấn vào đây để xem tài liệu"} 
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                      </a>
                                  </div>
                              )
                          )}
                       </div>
                    )}

                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}