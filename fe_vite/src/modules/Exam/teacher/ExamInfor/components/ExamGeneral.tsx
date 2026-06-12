import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { DateTimeFormat, isoDateUtil } from "../../../../../share/utils/date";
import type { De } from "../../../../../share/interfaces/exam.interface";

interface ExamGeneralProps {
  de: De;
}

export const ExamGeneral: React.FC<ExamGeneralProps> = ({ de }) => {
  const { createdAt, khoiLopTen, monHocTen } = de;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap strokeWidth={1.5} className="size-4" />
          <div className="flex items-center gap-2">
            {khoiLopTen ? (
              <span className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600">
                {khoiLopTen}
              </span>
            ) : (
              <span className="text-xs text-slate-400">Chưa có khối</span>
            )}
            {monHocTen && (
              <span className="rounded-md bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-600">
                {monHocTen}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar strokeWidth={1.5} className="size-4" />
          <div className="text-sm">
            <strong>Ngày tạo:</strong>{" "}
            {isoDateUtil.toDateAndTime(
              createdAt,
              DateTimeFormat.FULL_DATE_TIME_FORMAT,
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock strokeWidth={1.5} className="size-4" />
          <div className="text-sm">
            <strong>Thời gian làm bài:</strong> {de.thoiGian}{" "}
            <strong>phút</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen strokeWidth={1.5} className="size-4" />
          <div className="text-sm">
            <strong>Số lớp được giao:</strong> {de.cacLopDaGiao?.length ?? 0}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle strokeWidth={1.5} className="size-4" />
          <div className="text-sm">
            <strong>Trạng thái:</strong>{" "}
            {de.daXuatBan ? "Đã xuất bản" : "Chưa xuất bản"}
          </div>
        </div>

        {de.batDau && (
          <div className="flex items-center gap-2">
            <Calendar strokeWidth={1.5} className="size-4" />
            <div className="text-sm">
              <strong>Bắt đầu:</strong>{" "}
              {isoDateUtil.toDateAndTime(
                de.batDau,
                DateTimeFormat.FULL_DATE_TIME_FORMAT,
              )}
            </div>
          </div>
        )}

        {de.ketThuc && (
          <div className="flex items-center gap-2">
            <Calendar strokeWidth={1.5} className="size-4" />
            <div className="text-sm">
              <strong>Kết thúc:</strong>{" "}
              {isoDateUtil.toDateAndTime(
                de.ketThuc,
                DateTimeFormat.FULL_DATE_TIME_FORMAT,
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
