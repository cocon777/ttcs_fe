import { useState } from 'react';
import axios from 'axios';

// 1. Khai báo kiểu dữ liệu (Interface) cho các Props truyền vào
interface TeacherFeedbackProps {
    resultId: number | string;
    initialFeedback?: string; // Dấu ? cho biết giá trị này có thể không được truyền vào (undefined)
    systemFeedback: string;
}

const TeacherFeedbackForm = ({ resultId, initialFeedback, systemFeedback }: TeacherFeedbackProps) => {
    const [teacherFeedback, setTeacherFeedback] = useState<string>(initialFeedback || '');
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSaveFeedback = async () => {
        setIsSaving(true);
        try {
            // Gọi API Update nhận xét của giáo viên
            await axios.put(`/api/exam-results/${resultId}/teacher-feedback`, {
                teacherFeedback: teacherFeedback
            });
            alert('Đã lưu nhận xét thành công!');
        } catch (error) {
            console.error("Lỗi khi lưu nhận xét", error);
            alert('Lỗi lưu dữ liệu!');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="feedback-container">
            <h4>Nhận xét của Hệ thống:</h4>
            <div className="system-feedback-box" style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f0f0f0', padding: '10px' }}>
                {systemFeedback}
            </div>

            <h4 style={{ marginTop: '20px' }}>Ghi chú / Nhận xét của Giáo viên:</h4>
            <textarea 
                rows={4} // 2. Đổi từ "4" thành {4} để phù hợp với kiểu number trong TypeScript
                style={{ width: '100%', padding: '10px' }}
                placeholder="Nhập nhận xét chi tiết cho học sinh này..."
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
            />
            <button onClick={handleSaveFeedback} disabled={isSaving} style={{ marginTop: '10px' }}>
                {isSaving ? 'Đang lưu...' : 'Lưu nhận xét'}
            </button>
        </div>
    );
};

export default TeacherFeedbackForm;