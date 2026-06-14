import { useNavigate } from "react-router-dom";

interface ActionProps {
  handlePublish: () => void;
}

const Action: React.FC<ActionProps> = (props) => {
  const { handlePublish } = props;
  const navigate = useNavigate();

  return (
    <div className="float-right mt-6 flex items-center gap-2 pb-20">
      <button
        className="ml-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg shadow transition-colors"
        onClick={() => navigate(-1)}
      >
        ← Quay lại
      </button>
      <div
        onClick={handlePublish}
        className="rounded-md border border-blue-500 bg-white px-4 py-2.5 shadow-sm hover:cursor-pointer hover:bg-blue-500"
      >
        <div className="text-sm font-semibold text-gray hover:text-white">
          Xuất bản/Cập nhật cấu hình đề
        </div>
      </div>
    </div>
  );
};

export default Action;
