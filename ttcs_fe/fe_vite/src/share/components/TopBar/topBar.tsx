import Menu from "../Menu/menu";

const TopBar = () => {
  return (
    <div className="w-full border-b border-solid border-slate-200 px-4 py-4 dark:border-slate-600">
      <div className="flex items-center justify-end gap-5">
        <Menu />
      </div>
    </div>
  );
};

export default TopBar;