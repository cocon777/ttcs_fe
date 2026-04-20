interface ActionProps {
  handlePublish: () => void;
}

const Action: React.FC<ActionProps> = (props) => {
  const { handlePublish } = props;

  return (
    <div className="float-right mt-6 flex items-center gap-2 pb-20">
      <div
        onClick={handlePublish}
        className="rounded-md bg-blue-900 px-4 py-2.5 shadow-sm hover:cursor-pointer"
      >
        <div className="text-sm font-semibold text-white">Xuất bản</div>
      </div>
    </div>
  );
};

export default Action;
