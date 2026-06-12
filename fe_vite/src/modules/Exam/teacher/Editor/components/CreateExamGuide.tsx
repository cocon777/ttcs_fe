import { BookOpen, ClipboardCopy, X } from "lucide-react";

interface CreateExamGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const MAU_SOAN_DE = `Câu 1.[NB] Nội dung câu hỏi 1 : mức độ NB : Nhận biết
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D
Câu 2.[TH] Nội dung câu hỏi 2 : mức độ TH : Thông hiểu
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D
Câu 3.[VD] Nội dung câu hỏi 3 : mức độ VD : Vận dụng
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D
Câu 4.[VDC] Nội dung câu hỏi 4 : mức độ VDC : Vận dụng cao
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D

---HẾT---
BẢNG ĐÁP ÁN
1A 2B 3C 4D`;

const LUU_Y = [
  {
    title: "Tiêu đề câu hỏi",
    desc: 'Bắt đầu bằng "Câu N.[MỨC_ĐỘ]", trong đó mức độ là một trong: NB, TH, VD, VDC.',
    example: "Câu 1.[NB] Nội dung câu hỏi...",
  },
  {
    title: "Lựa chọn",
    desc: "Mỗi lựa chọn bắt đầu bằng chữ cái (A–G) theo sau là dấu chấm và khoảng trắng.",
    example: "A. Nội dung lựa chọn A",
  },
  {
    title: "Kết thúc nội dung",
    desc: 'Sau câu hỏi cuối cùng, thêm dòng "---HẾT---" để phân tách.',
    example: "---HẾT---",
  },
  {
    title: "Bảng đáp án",
    desc: 'Sau "BẢNG ĐÁP ÁN", liệt kê đáp án theo dạng: số thứ tự + chữ cái đáp án đúng.',
    example: "1A 2B 3C 4D",
  },
  {
    title: "Công thức toán",
    desc: "Dùng cú pháp LaTeX bọc trong $$...$$ để chèn công thức.",
    example: "$$x^2 + y^2 = z^2$$",
  },
  {
    title: "Hình ảnh",
    desc: "Dùng nút 'Chèn ảnh' hoặc paste ảnh trực tiếp vào editor. Tag ảnh sẽ tự động được chèn.",
    example: "[img:$https://url-anh.com/anh.png$]",
  },
];

const CreateExamGuide: React.FC<CreateExamGuideProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl max-h-[88vh] flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-blue-600" />
            <span className="text-base font-semibold text-gray-800">
              Mẫu soạn đề & Hướng dẫn
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-red-300 cursor-pointer"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                📄 Mẫu soạn đề
              </p>

              <button
                onClick={() => navigator.clipboard.writeText(MAU_SOAN_DE)}
                className="flex items-center gap-1 rounded border border-blue-500 px-2 py-1 text-xs hover:bg-blue-500 hover:text-white cursor-pointer"
              >
                <ClipboardCopy className="size-3.5" />
                Sao chép
              </button>
            </div>

            <pre className="overflow-x-auto whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-4 font-mono text-[13px] leading-relaxed text-gray-700">
              {MAU_SOAN_DE}
            </pre>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Lưu ý khi soạn đề
            </p>

            <div className="space-y-2.5">
              {LUU_Y.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-3.5"
                >
                  <div className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                      {i + 1}
                    </span>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.desc}
                      </p>

                      <code className="mt-1.5 inline-block rounded border border-blue-400 bg-blue-100 px-2 py-0.5 font-mono text-[12px] text-black-800">
                        {item.example}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-xs font-bold text-red-500">
            * Áp dụng mẫu sẽ thay thế toàn bộ nội dung hiện tại.
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Đóng
            </button>

            <button
              onClick={onApply}
              className="rounded border border-blue-500 bg-white-500 px-5 py-2 text-sm font-medium text-blue-500 hover:bg-blue-600 hover:text-white"
            >
              Áp dụng mẫu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamGuide;
