type ClassExamStatusProps = {
  message: string;
};

const ClassExamStatus = ({ message }: ClassExamStatusProps) => {
  return (
    <div className="rounded-md bg-white p-4 text-sm text-slate-600 shadow-sm">
      {message}
    </div>
  );
};

export default ClassExamStatus;
