import { useEffect, useState } from "react";
import Dropdown from "../DropDown/dropDown";
import GradeAPI from "../../../services/apis/gradeAPI";
import SubjectAPI from "../../../services/apis/subjectAPI";
import type { KhoiLop, MonHoc } from "../../interfaces/infor.interface";

type Tab = {
  name: string;
  value: any;
};

interface CategoryFormProps {
  khoiLopId: number;
  monHocId: number;
  handleChangeConfig: (ten: string, giaMoi: any) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const { khoiLopId, monHocId, handleChangeConfig } = props;

  const [khoiLopDaChon, setKhoiLopDaChon] = useState<Tab | null>(null);
  const [monHocDaChon, setMonHocDaChon] = useState<Tab | null>(null);
  const [danhSachKhoiLop, setDanhSachKhoiLop] = useState<Tab[] | null>(null);
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<Tab[] | null>(null);

  useEffect(() => {
    const layDuLieuBanDau = async () => {
      const [khoiLopRes, monHocRes] = await Promise.all([
        GradeAPI.getAll(),
        SubjectAPI.getByGradeId(khoiLopId),
      ]);

      if (khoiLopRes?.status === 200) {
        const dsKhoiLop: Tab[] = khoiLopRes.data.map((kl: KhoiLop) => ({
          name: kl.ten,
          value: kl.id,
        }));
        setDanhSachKhoiLop(dsKhoiLop);

        const khoiLopHienTai =
          dsKhoiLop.find((kl) => kl.value === khoiLopId) || null;
        setKhoiLopDaChon(khoiLopHienTai);
      }

      if (monHocRes?.status === 200) {
        const dsMonHoc: Tab[] = monHocRes.data.map((mh: MonHoc) => ({
          name: mh.ten,
          value: mh.id,
        }));
        setDanhSachMonHoc(dsMonHoc);

        const monHocHienTai =
          dsMonHoc.find((mh) => mh.value === monHocId) || null;
        setMonHocDaChon(monHocHienTai);
      }
    };

    layDuLieuBanDau();
  }, []);

  useEffect(() => {
    const layMonHocTheoKhoi = async () => {
      if (!khoiLopDaChon?.value) return;

      const res = await SubjectAPI.getByGradeId(khoiLopDaChon.value);
      if (res?.status === 200) {
        const dsMonHoc: Tab[] = res.data.map((mh: MonHoc) => ({
          name: mh.ten,
          value: mh.id,
        }));
        setDanhSachMonHoc(dsMonHoc);

        if (khoiLopId !== khoiLopDaChon.value) {
          handleChangeConfig("monHocId", null);
        }

        const monHocHienTai =
          dsMonHoc.find((mh) => mh.value === monHocId) || null;
        setMonHocDaChon(monHocHienTai);
      }
    };

    layMonHocTheoKhoi();
  }, [khoiLopDaChon]);

  useEffect(() => {
    if (khoiLopDaChon) {
      handleChangeConfig("khoiLopId", khoiLopDaChon.value || null);
    }
    if (monHocDaChon) {
      handleChangeConfig("monHocId", monHocDaChon.value || null);
    }
  }, [khoiLopDaChon, monHocDaChon]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <span className="mb-2 flex text-sm font-medium">Khối học</span>
        <Dropdown
          options={danhSachKhoiLop}
          selectedValue={khoiLopDaChon}
          setSelectedValue={setKhoiLopDaChon}
          title="Chọn khối lớp"
        />
      </div>

      <div className="col-span-6">
        <span className="mb-2 flex text-sm font-medium">Môn học</span>
        <Dropdown
          options={danhSachMonHoc}
          selectedValue={monHocDaChon}
          setSelectedValue={setMonHocDaChon}
          title="Chọn môn học"
        />
      </div>
    </div>
  );
};
