import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { classAPI } from "../../../../services/apis/classAPI";
import examAPI from "../../../../services/apis/examAPI";
import type { StudentClass } from "../../../../services/apis/classAPI";
import type { ExamListItem } from "../../../../services/apis/examAPI";
import ClassExamHeader from "../components/ClassExamHeader";
import ClassExamCard from "../components/ClassExamCard";
import ClassExamStatus from "../components/ClassExamStatus";

const ClassExamListPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [classItem, setClassItem] = useState<StudentClass | null>(null);
  const [examList, setExamList] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [classData, allExams] = await Promise.all([
        classAPI.getClassById(classId),
        examAPI.getExamListByClass(classId),
      ]);

      // 🚀 ĐÃ SỬA: classData đã là StudentClass, không cần .data nữa
      if (classData) {
        setClassItem(classData);
      }
      
      if (allExams) {
        setExamList(allExams);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [classId]);

  if (loading) {
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-5xl py-8">
          <ClassExamStatus message="Đang tải danh sách đề của lớp..." />
        </div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="w-full text-gray-800">
        <div className="mx-auto w-11/12 max-w-5xl py-8">
          <ClassExamStatus message="Không tìm thấy lớp học." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-gray-800">
      <div className="mx-auto w-11/12 max-w-5xl py-8">
        <ClassExamHeader classItem={classItem} />

        {examList.length === 0 ? (
          <ClassExamStatus message="Lớp này chưa có đề được giao." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {examList.map((exam) => (
              <ClassExamCard key={exam.id} exam={exam} classId={classId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassExamListPage;