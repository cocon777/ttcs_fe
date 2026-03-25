import { useEffect, useState } from "react";
import { Search, Share2 } from "lucide-react";
import StudentTable from "../components/studentTable";
import { useParams } from "react-router";
import type {
  LopHoc,
  HocSinhLop,
} from "../../../../../share/interfaces/infor.interface";
import AddStudent from "../components/addStudent";
import type { AxiosResponse } from "axios";
import { ClassroomAPI } from "../../../../../services/apis/classroomAPI";

const ListStudent = () => {
  const { classId } = useParams();
  const [classroom, setClassroom] = useState<LopHoc | null>(null);
  const [listStudent, setListStudent] = useState<HocSinhLop[]>([]);
  const [homeworkTotal, setHomeworkTotal] = useState<number>(0);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (classId) {
        const response: AxiosResponse | null =
          await ClassroomAPI.getStudents(classId);
        console.log("student profile: ", response);
        if (!response) {
          return;
        }
        const data = response.data;
        setClassroom(data);
        setListStudent(data?.studentClasses || []);
        setHomeworkTotal(data?.assignments?.length || 0);
      }
    };

    fetchStudentProfile();
  }, []);

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-gray-800 dark:text-slate-300">
            <span className="mr-2 text-xl font-semibold">
              {classroom?.tenLop}
            </span>
            <span className="">{classroom?.namHoc}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-2 py-1 text-gray-500 dark:text-slate-300">
          <Share2 className="size-4" strokeWidth={1.5} />
          <div className="text-xs font-semibold">Chia sẻ</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            className="w-60 rounded-md border border-gray-300 px-2.5 py-2 text-sm dark:border-none dark:border-darkmode-300 dark:bg-darkmode-800"
            placeholder="Tìm theo tên, sđt, email"
          />
          <Search className="absolute right-2.5 top-3 size-4 text-slate-600 dark:text-slate-300" />
        </div>

        <div className="flex items-center gap-2">
          <AddStudent
            listStudent={listStudent}
            setListStudent={setListStudent}
          />
        </div>
      </div>

      <StudentTable
        homeworkTotal={homeworkTotal}
        listStudent={listStudent}
        setListStudent={setListStudent}
      />
    </div>
  );
};

export default ListStudent;
