import { Pencil, Settings, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import CreateExamAPI from "../../../../../services/apis/createExamAPI";
import toast from "react-hot-toast";
interface ExamMenuProps {
  tieuDe?: string;
}
import SectionBox from "./SectionBox";

const ExamMenu = ({ tieuDe = "" }: ExamMenuProps) => {
  const navigate = useNavigate();
  const { deId } = useParams();

  const handleRemove = async () => {
    if (!deId) return;
    const response = await CreateExamAPI.remove(deId);
    if (response?.status !== 200) {
      toast.error("Xóa đề thất bại");
      return;
    }
    toast.success("Xóa đề thành công");
    navigate(-1);
  };

  return (
    <SectionBox title="Tùy chọn">
  <div className="space-y-1">
        <Link
          to={`/teacher/exam/exam-config/${deId}`}
          className="flex items-center gap-2 rounded-md p-2 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-blue-200"
        >
          <Settings strokeWidth={1.5} className="size-4" />
          <div className="text-sm">
            Cấu hình đề (tên, thời hạn, giao cho lớp)
          </div>
        </Link>

        <Link
          to={`/teacher/exam/editor?deId=${deId}&tieuDe=${encodeURIComponent(tieuDe)}`}
          className="flex items-center gap-2 rounded-md p-2 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-blue-200"
        >
          <Pencil strokeWidth={1.5} className="size-4" />
          <div className="text-sm">Sửa đề</div>
        </Link>

        <div
          className="flex items-center gap-2 rounded-md p-2 text-red-600 transition-colors duration-200 ease-in-out hover:cursor-pointer hover:bg-blue-200 dark:hover:bg-darkmode-400 dark:hover:text-black"
          onClick={handleRemove}
        >
          <Trash2 strokeWidth={1.5} className="size-4" />
          <div className="text-sm">Xóa đề</div>
        </div>
      </div>
    </SectionBox>
  );
};

export default ExamMenu;
