import type  { ReactNode } from "react";

interface CopyBoxProps {
  copyText: string;
  children: ReactNode;
}
const CopyBox: React.FC<CopyBoxProps> = (props) => {
  const { copyText, children } = props;

  const handleCopyExamURL = () => {
      navigator.clipboard.writeText(copyText);
      
  };

  return (
    <div onClick={handleCopyExamURL} className="hover:cursor-pointer">
      {children}
    </div>
  );
};

export default CopyBox;
