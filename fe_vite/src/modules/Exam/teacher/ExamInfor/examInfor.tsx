import { useParams } from "react-router";
import { useEffect, useState } from "react";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
// import { ExamInfo } from "./libs/interface";
import ExamInfoArea from "./layouts/examInforArea";
import type { AxiosResponse } from "axios";
import type { De } from "../../../../share/interfaces/exam.interface";

const ExamInfor = () => {
  const { deId } = useParams();
  const [de, setDe] = useState<De>({} as De);

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
      <div className="w-full max-w-4xl ">
        <ExamInfoArea de={de} setDe={setDe} />
      </div>
    </div>
  );
};

export default ExamInfor;
