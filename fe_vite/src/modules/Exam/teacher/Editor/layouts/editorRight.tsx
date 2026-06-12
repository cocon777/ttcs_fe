import { Sigma, Loader2, BookOpen } from "lucide-react";
import { useRef, useState } from "react";
import CustomEditor, {
  type CustomEditorHandle,
} from "../components/customEditor";
import UploadButton from "../components/UploadButton";
import FormulaEditor from "../components/FormulaEditor";
import CreateExamGuide from "../components/CreateExamGuide";

const MAU_SOAN_DE = `Câu 1.[NB] Nội dung câu hỏi 1 : mức độ NB : Nhận biết
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D
Câu 2.[TH] Nội dung câu hỏi 2 : mức độ TH : Thông hiểu
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D
Câu 3.[VD] Nội dung câu hỏi 3 : mức độ VD : Vận dụng
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D
Câu 4.[VDC] Nội dung câu hỏi 4 : mức độ VDC : Vận dụng cao
A. Lựa chọn A
B. Lựa chọn B
C. Lựa chọn C
D. Lựa chọn D

---HẾT---
BẢNG ĐÁP ÁN
1A 2B 3C 4D`;

interface EditorRightProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  goToLine: number;
}

const EditorRight: React.FC<EditorRightProps> = (props) => {
  const { value, setValue, goToLine } = props;
  const customEditorRef = useRef<CustomEditorHandle>(null);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  //  Upload txt/docx
  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      customEditorRef.current?.insertTextAtCursor(content);
    };
    reader.readAsText(file);
  };

  //  Chèn tag ảnh (từ UploadButton hoặc paste trong editor)
  const handleInsertImageTag = (tag: string) => {
    customEditorRef.current?.insertTextAtCursor(tag);
  };

  //  Chèn công thức
  const handleInsertFormula = (formula: string) => {
    customEditorRef.current?.insertTextAtCursor(formula);
  };

  //Áp dụng mẫu đề
  const handleApplyTemplate = () => {
    setValue(MAU_SOAN_DE);
    localStorage.setItem("exam", MAU_SOAN_DE);
    setTemplateOpen(false);
  };

  return (
    <div className="col-span-6">
      <div className="border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex border-b border-gray-200 dark:text-slate-300">
          <div
            className="flex items-center gap-2 border-r border-gray-200 p-2.5 hover:cursor-pointer hover:bg-amber-50"
            onClick={() => setTemplateOpen(true)}
          >
            <BookOpen className="size-5 text-blue-600" strokeWidth={1.5} />
            <div className="text-[13px] text-blue-700 font-medium">
              Mẫu soạn đề
            </div>
          </div>

          <UploadButton
            onUpload={handleUpload}
            onInsertImageTag={handleInsertImageTag}
          />

          <div
            className="flex items-center gap-2 border-r border-gray-200 p-2.5 hover:cursor-pointer hover:bg-gray-100"
            onClick={() => setFormulaOpen(true)}
          >
            <Sigma
              className="size-5 text-gray-700 dark:text-slate-300"
              strokeWidth={1.5}
            />
            <div className="text-[13px]">Chèn công thức</div>
          </div>

          {/* Upload progress indicator (khi paste ảnh vào editor) */}
          {imageUploading && (
            <div className="flex items-center gap-2 px-3 text-blue-600">
              <Loader2 className="size-4 animate-spin" strokeWidth={2} />
              <span className="text-[13px]">Đang tải ảnh...</span>
            </div>
          )}
        </div>

        <CustomEditor
          ref={customEditorRef}
          value={value}
          setValue={setValue}
          goToLine={goToLine}
          onUploadStart={() => setImageUploading(true)}
          onUploadEnd={() => setImageUploading(false)}
        />
      </div>

      <FormulaEditor
        isOpen={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        onInsert={handleInsertFormula}
      />

      <CreateExamGuide
        isOpen={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onApply={handleApplyTemplate}
      />
    </div>
  );
};

export default EditorRight;
