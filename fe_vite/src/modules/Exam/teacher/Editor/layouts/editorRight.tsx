import { Sigma } from "lucide-react";
import { useRef } from "react";
import CustomEditor, {
  type CustomEditorHandle,
} from "../components/customEditor";
import UploadButton from "../components/UploadButton";

interface EditorRightProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  goToLine: number;
}

const EditorRight: React.FC<EditorRightProps> = (props) => {
  const { value, setValue, goToLine } = props;
  const customEditorRef = useRef<CustomEditorHandle>(null);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (customEditorRef.current) {
        customEditorRef.current.insertTextAtCursor(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="col-span-6">
      <div className="border border-gray-200 bg-white shadow-sm">
        <div className="flex border-b border-gray-200 dark:text-slate-300">
          <UploadButton onUpload={handleUpload} />

          <div className="flex items-center gap-2 border-r border-gray-200 p-2.5 hover:cursor-pointer hover:bg-gray-100">
            <Sigma
              className="size-5 text-gray-700 dark:text-slate-300"
              strokeWidth={1.5}
            />
            <div className="text-[13px]">Chèn công thức</div>
          </div>
        </div>

        <CustomEditor
          ref={customEditorRef}
          value={value}
          setValue={setValue}
          goToLine={goToLine}
        />
      </div>
    </div>
  );
};

export default EditorRight;
