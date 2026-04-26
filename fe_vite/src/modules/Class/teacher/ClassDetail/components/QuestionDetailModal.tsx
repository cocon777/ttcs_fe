import React from "react";
import Modal from "antd/es/modal/Modal";

interface Answer {
  kyHieu: string;
  noiDung: string;
  laDapAn?: boolean;
}

interface QuestionDetailModalProps {
  open: boolean;
  onClose: () => void;
  question: any;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  open,
  onClose,
  question,
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    title={question ? `Chi tiết câu hỏi ID ${question.id}` : ""}
  >
    {question && (
      <div>
        <div className="mb-2 font-semibold">Nội dung câu hỏi:</div>
        <div className="mb-4">{question.content}</div>
        {question.answers && question.answers.length > 0 && (
          <div>
            <div className="mb-2 font-semibold">Đáp án:</div>
            <ul className="list-disc pl-5">
              {question.answers.map((ans: Answer, idx: number) => (
                <li
                  key={idx}
                  className={ans.laDapAn ? "text-green-600 font-bold" : ""}
                >
                  <span className="mr-2">{ans.kyHieu}.</span> {ans.noiDung}
                  {ans.laDapAn && (
                    <span className="ml-2 text-green-600">(Đáp án đúng)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}
  </Modal>
);

export default QuestionDetailModal;
