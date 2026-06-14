import AllExams from "./layouts/allExam";
import { useEffect, useState } from "react";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
import type { De } from "../../../../share/interfaces/exam.interface";
import { Link } from "react-router-dom";

const ExamManagement = () => {

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
