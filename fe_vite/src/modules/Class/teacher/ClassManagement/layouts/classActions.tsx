import { ArrowDown01, Filter } from "lucide-react";
import AddClassBtn from "../components/addClassBtn";

const ClassActions = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
      <div className="text-xl font-medium">Danh sách lớp</div>
      <div className="flex items-center justify-between gap-2">
        <AddClassBtn />
      </div>
    </div>
  );
};

export default ClassActions;
