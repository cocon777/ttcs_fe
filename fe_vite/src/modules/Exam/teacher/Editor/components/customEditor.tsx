import MonacoEditor from "react-monaco-editor";
import { options } from "../utils/monacoConfig";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { uploadToCloudinary } from "../../../../../share/utils/uploadToCloudinary";

interface CustomEditorProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  goToLine?: number;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export interface CustomEditorHandle {
  insertTextAtCursor: (text: string) => void;
}

const CustomEditor = forwardRef<CustomEditorHandle, CustomEditorProps>(
  (props, ref) => {
    const { value, setValue, goToLine, onUploadStart, onUploadEnd } = props;
    const editorRef = useRef<any>(null);

    // ── Expose insertTextAtCursor ───────────────────────────
    useImperativeHandle(ref, () => ({
      insertTextAtCursor: (text: string) => {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        const selection = editor.getSelection();
        editor.executeEdits({ major: 1, minor: 1 }, [
          { range: selection, text, forceMoveMarkers: true },
        ]);
        editor.focus();
      },
    }));

    // ── Paste ảnh từ clipboard ──────────────────────────────
    const setupPasteListener = (editor: any) => {
      const domNode: HTMLElement | null = editor.getDomNode();
      if (!domNode) return;

      domNode.addEventListener("paste", async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            // Ngăn Monaco xử lý paste mặc định
            e.stopPropagation();
            e.preventDefault();

            const file = item.getAsFile();
            if (!file) continue;

            onUploadStart?.();

            // Chèn placeholder tạm trong khi upload
            const placeholderTag = `[img:$uploading...$]`;
            const selection = editor.getSelection();
            editor.executeEdits({ major: 1, minor: 1 }, [
              {
                range: selection,
                text: placeholderTag,
                forceMoveMarkers: true,
              },
            ]);

            try {
              const result = await uploadToCloudinary(file);
              const imageTag = `[img:$${result.secure_url}$]`;

              // Thay placeholder bằng URL thật
              const currentValue: string = editor.getValue();
              const newValue = currentValue.replace(placeholderTag, imageTag);
              editor.setValue(newValue);

              // Cập nhật state
              setValue(newValue);
              localStorage.setItem("exam", newValue);
            } catch (err) {
              // Nếu lỗi, xóa placeholder
              const currentValue: string = editor.getValue();
              editor.setValue(currentValue.replace(placeholderTag, ""));
              alert("Upload ảnh thất bại. Vui lòng thử lại.");
            } finally {
              onUploadEnd?.();
              editor.focus();
            }
            break; // Chỉ xử lý ảnh đầu tiên
          }
        }
      });
    };

    // ── Editor mount ────────────────────────────────────────
    const editorDidMount = (editor: any) => {
      editorRef.current = editor;
      editor.focus();

      if (goToLine) {
        editor.revealLineInCenter(goToLine);
        editor.setPosition({ lineNumber: goToLine, column: 1 });
      }

      setupPasteListener(editor);
    };

    // ── GoTo line ───────────────────────────────────────────
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

    // ── Monaco language + theme ──────────────────────────────
    const editorWillMount = (monaco: any) => {
      if (
        monaco.languages
          .getLanguages()
          .some(({ id }: { id: string }) => id === "custom-editor")
      )
        return;

      monaco.languages.register({ id: "custom-editor" });

      monaco.languages.setMonarchTokensProvider("custom-editor", {
        tokenizer: {
          root: [
            [/---HẾT---/, "custom-het"],
            [/BẢNG ĐÁP ÁN/, "custom-bang-dap-an"],
            [/Câu \d+\./, "custom-cau"],
            [/\[(NB|TH|VD|VDC)\]/, "custom-mucdo"],
            [/^[A-G]\./, "custom-lua-chon"],
            // Highlight tag ảnh
            [/\[img:\$[^\$]*\$\]/, "custom-image-tag"],
          ],
        },
      });

      monaco.editor.defineTheme("custom-theme", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "custom-cau", foreground: "1e40af", fontStyle: "bold" },
          { token: "custom-mucdo", foreground: "8f4106" },
          { token: "custom-lua-chon", foreground: "ff0039", fontStyle: "bold" },
          { token: "custom-het", foreground: "1e40af" },
          {
            token: "custom-bang-dap-an",
            foreground: "1e40af",
            fontStyle: "bold",
          },
          // Màu tím nhẹ cho tag ảnh
          {
            token: "custom-image-tag",
            foreground: "7c3aed",
            fontStyle: "italic",
          },
        ],
        colors: {},
      });

      monaco.languages.setLanguageConfiguration("custom-editor", {
        comments: { lineComment: "//", blockComment: ["/*", "*/"] },
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
    };

    return (
      <MonacoEditor
        height="560"
        options={{ ...options, theme: "custom-theme" }}
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
