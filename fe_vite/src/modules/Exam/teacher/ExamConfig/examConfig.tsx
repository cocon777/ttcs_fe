import { useEffect, useState } from "react";
import Action from "./layouts/action";
import Config from "./layouts/config";
import CreateExamAPI from "../../../../services/apis/createExamAPI";
import { useNavigate, useParams } from "react-router";
import type {
  De,
  LopHocRef,
} from "../../../../share/interfaces/exam.interface";

const ExamConfig = () => {
  const navigate = useNavigate();
  const { deId } = useParams();

  const [deConfig, setDeConfig] = useState<De>({} as De);
  const [tatCaLop, setTatCaLops] = useState<LopHocRef[]>([]);

  const handleChangeConfig = (name: string, newValue: any) => {
    setDeConfig((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleToggleLop = (lopId: number) => {
    setDeConfig((prev) => ({
      ...prev,
      cacLopDaGiao: prev.cacLopDaGiao?.includes(lopId)
        ? prev.cacLopDaGiao.filter((id) => id !== lopId)
        : [...(prev.cacLopDaGiao ?? []), lopId],
    }));
  };

  const handlePublish = async () => {
    if (!deId) return;

    const response: any = await CreateExamAPI.publish(deId, deConfig);

    if (response?.status === 201) {
      const updated: De = response.data;
      navigate(`/teacher/exam/exam-publish/${updated.maHash}`);
    }
  };

  useEffect(() => {
    if (!deId) return;

    const fetchExamData = async () => {
      const [configRes, lopsRes] = await Promise.all([
        CreateExamAPI.getConfig(deId),
        CreateExamAPI.getTatCaLop(),
      ]);

      if (configRes?.data) setDeConfig(configRes.data as De);
      if (lopsRes?.data) setTatCaLops(lopsRes.data as LopHocRef[]);
    };

    fetchExamData();
  }, [deId]);

  const isReady = deConfig && Object.keys(deConfig).length !== 0;

  return (
    <div className="w-full px-5 dark:text-slate-300">
      {isReady && (
        <div className="mx-auto max-w-[1150px] space-y-6 text-sm">
          <div className="pt-4 text-center font-semibold text-gray-800 dark:text-slate-300">
            {`Tên đề thi: ${deConfig.tieuDe} - Mã đề: ${deConfig.maHash}`}
          </div>

          <Config
            deConfig={deConfig}
            tatCaLop={tatCaLop}
            onToggleLop={handleToggleLop}
            handleChangeConfig={handleChangeConfig}
          />

          <Action handlePublish={handlePublish} />
        </div>
      )}
    </div>
  );
};

export default ExamConfig;
