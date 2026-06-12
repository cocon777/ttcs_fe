import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EditorRight from "./layouts/editorRight";
import PreviewLeft from "./layouts/previewLeft";
import convertToJSON, { type NoiDungDe } from "./utils/formatExam";
import CreateExamAPI from "../../../../services/apis/createExamAPI";

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

/* Chuyển response của getContent() → chuỗi text cho Monaco editor */
function apiContentToEditorText(data: any): string {
  if (!data?.cauHois?.length) return "";

  const dapAnMap: Record<number, string> = {};
  let body = "";

  const cauHois = [...data.cauHois].sort((a: any, b: any) => a.thuTu - b.thuTu);

  for (const cauHoi of cauHois) {
    const mucDo = cauHoi.mucDo ?? "NB";
    body += `Câu ${cauHoi.thuTu}.[${mucDo}] ${cauHoi.noiDung}\n`;

    for (const lc of cauHoi.luaChons ?? []) {
      body += `${lc.kyHieu}. ${lc.noiDung}\n`;
      if (lc.laDapAn) {
        dapAnMap[cauHoi.thuTu] = lc.kyHieu;
      }
    }
  }

  const bangDapAn = Object.entries(dapAnMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([idx, ans]) => `${idx}${ans}`)
    .join(" ");

  return `${body}---HẾT---\nBẢNG ĐÁP ÁN\n${bangDapAn}`;
}

const Editor = () => {
  const [searchParams] = useSearchParams();
  const editDeId = searchParams.get("deId");
  const isEditMode = Boolean(editDeId);

  // const savedEditorValue = localStorage.getItem("exam") ?? "";
  // const [editorValue, setEditorValue] = useState(
  //   isEditMode ? "" : savedEditorValue,
  // );

  const savedEditorValue = localStorage.getItem("exam");
  const [editorValue, setEditorValue] = useState(
    isEditMode ? "" : (savedEditorValue ?? MAU_SOAN_DE),
  );

  const [de, setDe] = useState<NoiDungDe>({ cauHois: {} });
  const [goToLine, setGoToLine] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleGoToLine = (line: number) => setGoToLine(line);

  /* Load nội dung đề khi ở chế độ sửa */
  useEffect(() => {
    if (!editDeId) return;

    const load = async () => {
      setLoading(true);
      try {
        const contentRes = await CreateExamAPI.getContent(editDeId);
        if (contentRes?.data) {
          const text = apiContentToEditorText(contentRes.data);
          setEditorValue(text);
          localStorage.setItem("exam", text);
        }
      } catch (err) {
        console.error("Không tải được nội dung đề:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [editDeId]);

  /* Parse editor text → JSON preview */
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const converted = convertToJSON(editorValue);
      setDe(converted);
      localStorage.setItem("exam", editorValue);
      localStorage.setItem("exam_json", JSON.stringify(converted));
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [editorValue]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Đang tải nội dung đề...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      <PreviewLeft de={de} handleGoToLine={handleGoToLine} />
      <EditorRight
        value={editorValue}
        setValue={setEditorValue}
        goToLine={goToLine}
      />
    </div>
  );
};

export default Editor;
