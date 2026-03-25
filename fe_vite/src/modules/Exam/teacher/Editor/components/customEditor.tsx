import MonacoEditor from "react-monaco-editor";
import { options } from "../utils/monacoConfig";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

interface CustomEditorProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  goToLine?: number;
}

export interface CustomEditorHandle {
  insertTextAtCursor: (text: string) => void;
}

const CustomEditor = forwardRef<CustomEditorHandle, CustomEditorProps>(
  (props, ref) => {
    const { value, setValue, goToLine } = props;
    const editorRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      insertTextAtCursor: (text: string) => {
        if (editorRef.current) {
          const editor = editorRef.current;
          const selection = editor.getSelection();
          const id = { major: 1, minor: 1 };
          editor.executeEdits(id, [
            {
              range: selection,
              text,
              forceMoveMarkers: true,
            },
          ]);
          editor.focus();
        }
      },
    }));

    const editorDidMount = (editor: any) => {
      editorRef.current = editor;
      editor.focus();
      if (goToLine) {
        editor.revealLineInCenter(goToLine);
        editor.setPosition({ lineNumber: goToLine, column: 1 });
      }
    };

    useEffect(() => {
      if (goToLine && editorRef.current) {
        editorRef.current.revealLineInCenter(goToLine);
        editorRef.current.setPosition({ lineNumber: goToLine, column: 1 });
        editorRef.current.focus();
      }
    }, [goToLine]);

    const handleEditorChange = (value: string) => {
      setValue(value);
      localStorage.setItem("exam", value);
    };

    const editorWillMount = (monaco: any) => {
      if (
        !monaco.languages
          .getLanguages()
          .some(({ id }: { id: String }) => id === "custom-editor")
      ) {
        monaco.languages.register({ id: "custom-editor" });

        monaco.languages.setMonarchTokensProvider("custom-editor", {
          tokenizer: {
            root: [
              [/---HẾT---/, "custom-het"],
              [/BẢNG ĐÁP ÁN/, "custom-bang-dap-an"],
              [/Câu \d+\./, "custom-cau"],
              [/\[(NB|TH|VD|VDC)\]/, "custom-mucdo"],
              [/^[A-G]\./, "custom-lua-chon"],
            ],
          },
        });

        monaco.editor.defineTheme("custom-theme", {
          base: "vs",
          inherit: true,
          rules: [
            { token: "custom-cau", foreground: "1e40af", fontStyle: "bold" },
            { token: "custom-mucdo", foreground: "8f4106" },
            {
              token: "custom-lua-chon",
              foreground: "ff0039",
              fontStyle: "bold",
            },
            { token: "custom-het", foreground: "1e40af" },
            {
              token: "custom-bang-dap-an",
              foreground: "1e40af",
              fontStyle: "bold",
            },
          ],
          colors: {},
        });

        monaco.languages.setLanguageConfiguration("custom-editor", {
          comments: {
            lineComment: "//",
            blockComment: ["/*", "*/"],
          },
          brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"],
          ],
          autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
          ],
          surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
          ],
        });
      }
    };

    return (
      <MonacoEditor
        height="560"
        options={{
          ...options, // Giữ các options cũ từ file config của bạn
          theme: "custom-theme", // Ép sử dụng theme bạn vừa định nghĩa
        }}
        language="custom-editor"
        value={value}
        onChange={handleEditorChange}
        editorDidMount={editorDidMount}
        editorWillMount={editorWillMount}
        className="w-full"
      />
    );
  },
);

export default CustomEditor;
