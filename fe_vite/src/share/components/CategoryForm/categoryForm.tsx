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
      try {
        const [khoiLopRes, monHocRes] = await Promise.all([
          GradeAPI.getAll(),
          khoiLopId !== -1 ? SubjectAPI.getByGradeId(khoiLopId) : Promise.resolve(null),
        ]);

        if (khoiLopRes?.status === 200) {
          // 🚀 TUYỆT CHIÊU PHÁ VỎ DỮ LIỆU KHỐI LỚP
          const rawKhoiLop = Array.isArray(khoiLopRes.data) ? khoiLopRes.data : (khoiLopRes.data?.data || khoiLopRes.data?.content || []);
          
          const dsKhoiLop: Tab[] = rawKhoiLop.map((kl: KhoiLop) => ({
            name: kl.ten,
            value: kl.id,
          }));
          setDanhSachKhoiLop(dsKhoiLop);

          const khoiLopHienTai = dsKhoiLop.find((kl) => kl.value === khoiLopId) || null;
          setKhoiLopDaChon(khoiLopHienTai);
        }

        if (monHocRes?.status === 200) {
          // 🚀 TUYỆT CHIÊU PHÁ VỎ DỮ LIỆU MÔN HỌC
          const rawMonHoc = Array.isArray(monHocRes.data) ? monHocRes.data : (monHocRes.data?.data || monHocRes.data?.content || []);
          
          const dsMonHoc: Tab[] = rawMonHoc.map((mh: MonHoc) => ({
            name: mh.ten,
            value: mh.id,
          }));
          setDanhSachMonHoc(dsMonHoc);

          const monHocHienTai = dsMonHoc.find((mh) => mh.value === monHocId) || null;
          setMonHocDaChon(monHocHienTai);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu ban đầu:", error);
      }
    };

    layDuLieuBanDau();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const layMonHocTheoKhoi = async () => {
      if (!khoiLopDaChon?.value) return;

      try {
        const res = await SubjectAPI.getByGradeId(khoiLopDaChon.value);
        if (res?.status === 200) {
          // 🚀 TUYỆT CHIÊU PHÁ VỎ KHI CHỌN KHỐI MỚI
          const rawMonHoc = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || []);
          
          const dsMonHoc: Tab[] = rawMonHoc.map((mh: MonHoc) => ({
            name: mh.ten,
            value: mh.id,
          }));
          setDanhSachMonHoc(dsMonHoc);

          if (khoiLopId !== khoiLopDaChon.value) {
            handleChangeConfig("monHocId", -1); // 🚀 Đổi thành -1 để Form Validate chuẩn
            setMonHocDaChon(null); // Reset ô Môn học trên giao diện
          } else {
            const monHocHienTai = dsMonHoc.find((mh) => mh.value === monHocId) || null;
            setMonHocDaChon(monHocHienTai);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy môn theo khối:", error);
      }
    };

    layMonHocTheoKhoi();
  }, [khoiLopDaChon]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (khoiLopDaChon) {
      handleChangeConfig("khoiLopId", khoiLopDaChon.value || -1);
    }
    if (monHocDaChon) {
      handleChangeConfig("monHocId", monHocDaChon.value || -1);
    }
  }, [khoiLopDaChon, monHocDaChon]); // eslint-disable-line react-hooks/exhaustive-deps

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