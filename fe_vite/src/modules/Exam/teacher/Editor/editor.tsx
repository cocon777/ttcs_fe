import { useEffect, useRef, useState } from "react";
import EditorRight from "./layouts/editorRight";
import PreviewLeft from "./layouts/previewLeft";
import convertToJSON, { type NoiDungDe } from "./utils/formatExam";

const Editor = () => {
  const savedEditorValue = localStorage.getItem("exam") ?? "";
  const [editorValue, setEditorValue] = useState(savedEditorValue);
  const [de, setDe] = useState<NoiDungDe>({ cauHois: {} });
  const [goToLine, setGoToLine] = useState<number>(1);

  const handleGoToLine = (line: number) => {
    setGoToLine(line);
  };

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const converted = convertToJSON(editorValue);
      setDe(converted);
      localStorage.setItem("exam", editorValue);
    }, 1000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [editorValue]);

  return (
    <div className="grid grid-cols-12">
      <PreviewLeft de={de} setDe={setDe} handleGoToLine={handleGoToLine} />

      <EditorRight
        value={editorValue}
        setValue={setEditorValue}
        goToLine={goToLine}
      />
    </div>
  );
};

export default Editor;
