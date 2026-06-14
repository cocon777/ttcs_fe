import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
// import { ExamInfo } from "./libs/interface";
import ExamInfoArea from "./layouts/examInforArea";
import type { AxiosResponse } from "axios";
import type { De } from "../../../../share/interfaces/exam.interface";

const ExamInfor = () => {
  const { deId } = useParams();
  const [de, setDe] = useState<De>({} as De);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (deId) {
        const response: AxiosResponse | null =
          await CreateExamAPI.getConfig(deId);
        setDe(response?.data);
      }
    };

    fetchData();
  }, [deId]);

  return (
    // <div className="flex justify-center p-5">
    //   <ExamInfoArea de={de} setDe={setDe} />
    // </div>
    <div className="flex justify-center p-5">
      <div className="w-full max-w-2xl ">
        <button
          className="ml-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg shadow transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
        <ExamInfoArea de={de} setDe={setDe} />
      </div>
    </div>
  );
};

export default ExamInfor;
