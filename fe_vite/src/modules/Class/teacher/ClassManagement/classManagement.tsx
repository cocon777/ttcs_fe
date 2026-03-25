import ClassActions from "./layouts/classActions";
import ClassList from "./layouts/classList";

const ClassManagement = () => {
  return (
    <div className="space-y-4 p-6 dark:text-slate-200">
      <ClassActions />
      <ClassList />
    </div>
  );
};

export default ClassManagement;
