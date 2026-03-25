import { useState } from "react";
import { CalendarCheck, Newspaper, User } from "lucide-react";
import ListStudent from "./layouts/ListStudent";

const TABS = [
  { icon: User, label: "Danh sách học sinh", index: 0 },
  { icon: CalendarCheck, label: "Bài giảng", index: 1 },
  { icon: Newspaper, label: "Đề thi", index: 2 },
];

const ClassDetail = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <ListStudent />;
      case 1:
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-12">
      <div className="sticky top-0 col-span-2 h-[660px] border-r border-gray-300 dark:border-darkmode-400">
        <div className="pl-6 pr-3 pt-6">
          {TABS.map((tab, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(tab.index)}
              className={
                "flex items-center gap-2 rounded-md px-2 py-2 hover:cursor-pointer dark:text-slate-300 " +
                (selectedIndex === tab.index && "bg-blue-800 text-white")
              }
            >
              <tab.icon className="size-4" strokeWidth={1.5} />
              <div className="text-sm">{tab.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-10">{renderContent()}</div>
    </div>
  );
};

export default ClassDetail;
