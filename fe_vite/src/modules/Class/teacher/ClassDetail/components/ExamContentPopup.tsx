import { FileText, X } from "lucide-react";
import React from "react";
import type {
  Option,
  Question,
  ExamContentPopupProps,
} from "../interface/interface.ts";
import renderContent from "../../../../../share/utils/renderContent.tsx";

const ExamContentPopup: React.FC<ExamContentPopupProps> = ({
  open,
  onClose,
  examContent,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="grid h-[70vh] w-[800px] max-w-[90vw] grid-cols-1 grid-rows-[auto,1fr] rounded bg-white shadow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded bg-gray-100 p-2">
          <div
            className="rounded p-1.5 hover:cursor-pointer hover:bg-red-100"
            onClick={onClose}
          >
            <X className="size-4 text-red-500" />
          </div>
        </div>
        {/* Nội dung đề */}
        <div className="space-y-6 overflow-y-scroll px-5 pt-8 text-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar]:w-2">
          {examContent?.questions?.map((question) => {
            const correctOptionKeys = question?.options
              ?.filter((opt) => opt.laDapAn)
              .map((opt) => opt.label);
            return (
              <div
                key={question.id}
                className="rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <h1 className="font-semibold text-gray-800">{`Câu ${question.questionNumber}`}</h1>
                <p className="leading-relaxed text-gray-700">
                  {renderContent(question.text)}
                </p>
                <ul className="mt-4 space-y-2">
                  {question?.options?.map((opt) => (
                    <li key={opt.id}>
                      <span className="font-semibold">{opt.label}. </span>
                      {renderContent(opt.text)}
                    </li>
                  ))}
                </ul>
                {correctOptionKeys?.length > 0 && (
                  <p className="mt-4 font-semibold text-green-600">{`Đáp án: ${correctOptionKeys.join(",")}`}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamContentPopup;
