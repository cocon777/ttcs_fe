import type { nguoiDungMoi } from "./interface";
interface RoleTabsProps {
  values: nguoiDungMoi;
  onChange: (name: string, newValue: string) => void;
}

const ROLETABS = [
  {
    label: "Học sinh",
    value: "HS",
  },
  {
    label: "Giáo viên",
    value: "GV",
  },
];

const RoleTabs: React.FC<RoleTabsProps> = (props) => {
  const { values, onChange } = props;

  return (
    <div className="flex w-full items-center">
      {ROLETABS.map((tab) => (
        <div
          onClick={() => onChange("vaiTro", tab.value)}
          className="flex-1 py-2 hover:cursor-pointer"
        >
          <div
            className={
              "flex items-center justify-center gap-2 " +
              (values["vaiTro"] === tab.value
                ? "text-blue-800"
                : "text-gray-400")
            }
          >
            <div className="text-sm font-semibold">{tab.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleTabs;
