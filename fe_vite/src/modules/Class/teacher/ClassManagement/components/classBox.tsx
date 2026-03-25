import { Ellipsis } from "lucide-react";
import type { LopHoc } from "../../../../../share/interfaces/infor.interface";
import { Link } from "react-router-dom";

interface ClassBoxProps {
  lopHoc: LopHoc;
}

const ClassBox: React.FC<ClassBoxProps> = (props) => {
  const { lopHoc } = props;
  const { id, tenLop, soLuongHS, namHoc } = lopHoc;

  return (
    <Link
      to={`/teacher/class/classroom-detail/${id}`}
      className="col-span-3 space-y-2 rounded-md bg-zinc-100 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-800">{tenLop}</div>
        <Ellipsis className="size-5 text-gray-500" />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>Sĩ số: {soLuongHS}</div>
        <div>Năm học: {namHoc}</div>
      </div>
    </Link>
  );
};

export default ClassBox;
