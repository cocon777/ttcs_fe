import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CreateExamAPI from "../../../../../services/apis/createExamAPI";
import type { De } from "../../../../../share/interfaces/exam.interface";
import renderContent from "../../../../../share/utils/renderContent";
import SectionBox from "./SectionBox";
export const ExamContent: React.FC = () => {
  const { deId } = useParams();
  const [isOpenPopup, setOpenPopup] = useState<boolean>(false);
  const [de, setDe] = useState<De | null>(null);

  const handleTogglePopup = () => {
    setOpenPopup(!isOpenPopup);
  };

  useEffect(() => {
    const fetchExamContent = async () => {
      if (!deId) return;
      const response = await CreateExamAPI.getContent(deId);
      if (response?.status !== 200) return;
      setDe(response.data);
    };

    fetchExamContent();
  }, [deId]);

  return (
    <SectionBox title="Nội dung">
      {" "}
      
      <div
        className="flex items-center gap-2 text-blue-800 hover:cursor-pointer hover:opacity-80 dark:text-blue-700"
        onClick={handleTogglePopup}
      >
        <FileText className="size-4" />
        <div className="text-sm font-medium">Xem đề</div>
      </div>
      {isOpenPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleTogglePopup}
        >
          <div
            className="grid h-[70vh] w-[800px] max-w-[90vw] grid-cols-1 grid-rows-[auto,1fr] rounded bg-white shadow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded bg-gray-100 p-2">
              <div
                className="rounded p-1.5 hover:cursor-pointer hover:bg-red-100"
                onClick={handleTogglePopup}
              >
                <X className="size-4 text-red-500" />
              </div>
            </div>

            {/* nội dung đề */}
            <div className="space-y-6 overflow-y-scroll px-5 pt-8 text-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar]:w-2">
              {de?.cauHois.map((cauHoi) => {
                const correctOptionKeys = cauHoi?.luaChons
                  .filter((luaChon) => luaChon.laDapAn)
                  .map((luaChon) => luaChon.kyHieu);

                return (
                  <div
                    key={cauHoi.id}
                    className="rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <h1 className="font-semibold text-gray-800">{`Câu ${cauHoi.thuTu}`}</h1>
                    <p className="leading-relaxed text-gray-700">
                      {renderContent(cauHoi.noiDung)}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {cauHoi?.luaChons.map((luaChon) => (
                        <li key={luaChon.kyHieu}>
                          <span className="font-semibold">
                            {luaChon.kyHieu}.{" "}
                          </span>
                          {renderContent(luaChon.noiDung)}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 font-semibold text-green-600">{`Đáp án: ${correctOptionKeys.join(",")}`}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </SectionBox>
  );
};
