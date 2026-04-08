import AllExams from "./layouts/allExam";
import { useEffect, useState } from "react";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
import type { De } from "../../../../share/interfaces/exam.interface";
import { Link } from "react-router-dom";

const ExamManagement = () => {
  // const [dsDe, setdsDe] = useState<any[]>([
  //   {
  //     id: 1,
  //     maHash: "ABC12345",
  //     tieuDe: "Kiểm tra 15 phút Toán",
  //     nguoiTao: { id: 1, vaiTro: "GV" },
  //     phamViGiao: "LOP",
  //     thoiGian: 15,
  //     batDau: "2025-03-01T07:00:00.000Z",
  //     ketThuc: "2025-03-01T07:15:00.000Z",
  //     gioiHanNop: 1,
  //     daXuatBan: true,
  //     createdAt: "2025-02-28T10:00:00.000Z",
  //     updatedAt: "2025-02-28T10:00:00.000Z",
  //     giaoChoLop: [
  //       {
  //         id: 1,
  //         de: 1,
  //         lopHoc: 2,
  //         lop: { id: 2, tenLop: "10A1", maLop: "L001", namHoc: "2024-2025" },
  //         createdAt: "2025-02-28T10:00:00.000Z",
  //       },
  //       {
  //         id: 2,
  //         de: 1,
  //         lopHoc: 3,
  //         lop: { id: 3, tenLop: "10A2", maLop: "L002", namHoc: "2024-2025" },
  //         createdAt: "2025-02-28T10:00:00.000Z",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     maHash: "XYZ98765",
  //     tieuDe: "Kiểm tra học kỳ Văn",
  //     nguoiTao: { id: 1, vaiTro: "GV" },
  //     phamViGiao: null,
  //     thoiGian: 90,
  //     batDau: null,
  //     ketThuc: null,
  //     gioiHanNop: null,
  //     daXuatBan: false,
  //     createdAt: "2025-03-01T08:00:00.000Z",
  //     updatedAt: "2025-03-01T08:00:00.000Z",
  //     giaoChoLop: [],
  //   },
  // ]);

  const [dsDe, setdsDe] = useState<De[]>([]);

  useEffect(() => {
    const fetchAllExamConfig = async () => {
      const response = await CreateExamAPI.getPreviewsExamList();
      setdsDe(response?.data);
    };

    fetchAllExamConfig();
  }, []);

  console.log("list exam config: ", dsDe);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between text-gray-800">
        <div className="relative">
          <input
            type="text"
            className="w-60 rounded-md px-2 py-2 text-sm dark:bg-[rgb(var(--color-darkmode-800))]"
            placeholder="Tìm kiếm"
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
          <Link
            to={"/teacher/exam/editor"}
            className="flex h-10 items-center gap-2 rounded-md bg-blue-500 px-14 py-2.5 text-sm font-bold text-white"
          >
            <span>Tạo đề thi</span>
          </Link>
        </div>
      </div>
      <AllExams des={dsDe} />
    </div>
  );
};

export default ExamManagement;
