import { useState, useEffect } from 'react';
// 🚀 Thêm import classAPI (Quang nhớ chỉnh lại số lượng ../ cho đúng với thư mục máy bạn nhé)
// 🚀 Chỉ cần đi thẳng vào ./services là tới!
import { classAPI } from './services/apis/classAPI';

export default function CreateLecture() {
    const [classList, setClassList] = useState<any[]>([]); 
    const [formData, setFormData] = useState({
        tieuDe: '',
        noiDung: '',
        idGiaoVien: 0, 
        danhSachIdLopHoc: [] as number[], 
        tenFile: '',
        urlFile: ''
    });

    // 1. TỰ ĐỘNG LẤY ID GIÁO VIÊN VÀ DANH SÁCH LỚP KHI MỞ TRANG
    useEffect(() => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : {};
        const teacherId = user?.id || 0;
        
        setFormData(prev => ({ ...prev, idGiaoVien: teacherId }));

        // 🚀 DÙNG classAPI ĐỂ LẤY DANH SÁCH LỚP CHUẨN XÁC
        const fetchClasses = async () => {
            try {
                const res = await classAPI.getAllByTeacher();
                if (res.status === 200) {
                    setClassList(res.data); // Đổ dữ liệu thật vào dropdown
                }
            } catch (err) {
                console.error("Không lấy được danh sách lớp", err);
            }
        };

        if (teacherId) {
            fetchClasses();
        }
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        // Xử lý riêng cho việc chọn lớp học
        if (name === "danhSachIdLopHoc") {
            setFormData({ ...formData, danhSachIdLopHoc: [Number(value)] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");
        const payload = {
            tieuDe: formData.tieuDe,
            noiDung: formData.noiDung,
            idGiaoVien: formData.idGiaoVien,
            danhSachIdLopHoc: formData.danhSachIdLopHoc,
            danhSachFile: formData.urlFile ? [{ tenFile: formData.tenFile, urlFile: formData.urlFile, loaiFile: "url" }] : []
        };

        try {
            const response = await fetch('http://localhost:8080/api/baigiang/tao-moi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert('Tạo bài giảng thành công!');
                // Có thể thêm lệnh navigate về trang danh sách ở đây
            } else {
                alert('Lỗi tạo bài giảng!');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert('Không thể kết nối đến server!');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>📚 TẠO BÀI GIẢNG MỚI</h2>
            <form onSubmit={handleSubmit}>
                
                {/* Chọn lớp học từ Database */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}><b>Chọn lớp học:</b></label>
                    <select name="danhSachIdLopHoc" onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">-- Chọn lớp học của bạn --</option>
                        {classList.map((item: any) => (
                            // 🚀 SỬA TÊN BIẾN CHO KHỚP VỚI JAVA (tenLop, namHoc)
                            <option key={item.id} value={item.id}>
                                Lớp {item.tenLop} (Năm học {item.namHoc})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}><b>Tiêu đề:</b></label>
                    <input type="text" name="tieuDe" value={formData.tieuDe} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}><b>Nội dung:</b></label>
                    <textarea name="noiDung" value={formData.noiDung} onChange={handleChange} required rows={4} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                {/* ... Các ô Chọn lớp, Tiêu đề, Nội dung ở trên ... */}

                {/* 🚀 KHU VỰC ĐÍNH KÈM TÀI LIỆU (Word, PPT, PDF, Google Drive...) */}
                <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px dashed #adb5bd' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📎 Đính kèm tài liệu (Không bắt buộc)</h4>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Tên tài liệu:</label>
                        <input 
                            type="text" 
                            name="tenFile" 
                            value={formData.tenFile} 
                            onChange={handleChange} 
                            placeholder="VD: Slide Bài 1, Tài liệu ôn tập Word..." 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Đường dẫn (Link Google Drive, OneDrive...):</label>
                        <input 
                            type="text" 
                            name="urlFile" 
                            value={formData.urlFile} 
                            onChange={handleChange} 
                            placeholder="Dán link tài liệu vào đây..." 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                        />
                    </div>
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    🚀 LƯU BÀI GIẢNG
                </button>
            </form>
        </div>
    );
}