// resultData được fetch từ API sau khi học sinh nộp bài hoặc xem lại lịch sử
const StudentResultView = ({ resultData }) => {
  if (!resultData) return <div>Đang tải dữ liệu...</div>;

  return (
    <div
      className="result-card"
      style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}
    >
      <h2>Kết quả bài kiểm tra</h2>
      <p>
        <strong>Điểm số:</strong> {resultData.totalScore} / 10
      </p>

      <hr />

      <div className="feedback-section">
        <h3>🤖 Nhận xét tự động từ Hệ thống</h3>
        {/* Sử dụng white-space: pre-wrap để giữ lại các ký tự xuống dòng (\n) từ Backend gửi lên */}
        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {resultData.systemFeedback}
        </p>
      </div>

      <hr />

      <div
        className="feedback-section"
        style={{
          backgroundColor: "#eef8fa",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>👩‍🏫 Nhận xét từ Giáo viên</h3>
        <p>
          {/* Logic kiểm tra: Nếu có nhận xét thì in ra, nếu rỗng hoặc null thì in chữ in nghiêng */}
          {resultData.teacherFeedback &&
          resultData.teacherFeedback.trim() !== "" ? (
            <span>{resultData.teacherFeedback}</span>
          ) : (
            <i style={{ color: "gray" }}>Giáo viên sẽ nhận xét sau.</i>
          )}
        </p>
      </div>
    </div>
  );
};

export default StudentResultView;
