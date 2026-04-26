import type { Student } from "../../../../../share/interfaces/student.interface";
const ExamStudentList = ({ students }: { students: Student[] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-indigo-100 mb-8">
      <h3 className="font-bold text-indigo-700 mb-4">
        Danh sách học sinh chi tiết
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50 border-b border-indigo-100">
              <th className="p-3 font-bold text-indigo-700 w-16">STT</th>
              <th className="p-3 font-bold text-indigo-700">Họ tên</th>
              <th className="p-3 font-bold text-indigo-700">Lần thi</th>
              <th className="p-3 font-bold text-indigo-700">Điểm</th>
              <th className="p-3 font-bold text-indigo-700">Thời gian làm</th>
              {/* <th className="p-3 font-bold text-indigo-700 text-center">Hành động</th> */}
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={student.id}
                className="border-b border-indigo-50 hover:bg-indigo-50/30 transition-colors"
              >
                <td className="p-3 text-slate-500">{idx + 1}</td>
                <td className="p-3 font-semibold text-slate-800">
                  {student.name}
                </td>
                <td className="p-3">{student.attempt}</td>
                <td className="p-3">{student.score}</td>
                <td className="p-3">{student.time} phút</td>
                {/* <td className="p-3 text-center">
                  <button className="text-indigo-600 hover:text-white hover:bg-indigo-500 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-semibold transition-all">Xem chi tiết</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamStudentList;
