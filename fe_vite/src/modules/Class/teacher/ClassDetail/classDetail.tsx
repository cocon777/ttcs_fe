import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarCheck,
  Newspaper,
  User,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";
import StudentManagement from "./StudentManagement";
import ExamListByClass from "./ExamListByClass";
import QuanLyBaiGiang from "./QuanLyBaiGiang";
import { classAPI } from "../../../../services/apis/classAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";

const TABS = [
  { icon: User, label: "Danh sách học sinh", index: 0 },
  { icon: CalendarCheck, label: "Bài giảng", index: 1 },
  { icon: Newspaper, label: "Danh sách đề thi", index: 2 },
];

const ClassDetail = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [classInfo, setClassInfo] = useState<StudentClass | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassInfo = async () => {
      if (!id) return;

      const lopHoc = await classAPI.getClassById(id);

      if (lopHoc) {
        setClassInfo(lopHoc);
      }
    };

    fetchClassInfo();
  }, [id]);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return id ? (
          <StudentManagement classId={Number(id)} />
        ) : (
          <div>Không tìm thấy lớp</div>
        );
      case 1:
        return <QuanLyBaiGiang />;
      case 2:
        return id ? (
          <ExamListByClass classId={Number(id)} />
        ) : (
          <div>Không tìm thấy đề</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-white">
      {/* Sidebar bên trái */}
      <div className="sticky top-0 col-span-2 h-[660px] border-r border-gray-300 dark:border-darkmode-400">
        <div className="pl-6 pr-3 pt-6">
          <div className="mb-6 px-2">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {classInfo?.tenLop ?? "Đang tải..."}
            </h1>

            <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500">
              {/* <span>
                <strong>Mã lớp: </strong>
                {classInfo?.maLop ?? "—"}
              </span> */}

              <span>
                <strong>Năm học: </strong>
                {classInfo?.namHoc ?? "—"}
              </span>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="size-4 text-indigo-500" />
                  <span>{classInfo?.khoiLop?.ten}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="size-4 text-cyan-500" />
                  <span>{classInfo?.monHoc?.ten}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="size-4 text-emerald-500" />
                  <span>Sĩ số: {classInfo?.soLuongHS}</span>
                </div>
              </div>
            </div>
          </div>
          {TABS.map((tab, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(tab.index)}
              className={
                "flex items-center gap-2 rounded-md px-3 py-2.5 mb-1 transition-all hover:cursor-pointer " +
                (selectedIndex === tab.index
                  ? "bg-blue-800 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300")
              }
            >
              <tab.icon className="size-4" strokeWidth={1.5} />
              <div className="text-sm font-medium">{tab.label}</div>
            </div>
          ))}
          <button
            className="ml-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow transition-colors"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className="col-span-10 bg-slate-50/50 p-6">{renderContent()}</div>
    </div>
  );
};

export default ClassDetail;
