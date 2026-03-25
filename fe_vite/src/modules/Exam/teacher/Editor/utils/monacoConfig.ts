import type { MonacoEditorProps } from "react-monaco-editor";

// autoIndent: "full" — tự động căn lề khi xuống dòng
// contextmenu: true — hiện menu chuột phải
// hideCursorInOverviewRuler: true — ẩn con trỏ ở thanh overview bên phải
// matchBrackets: "always" — luôn highlight cặp ngoặc (), [], {}
// minimap: false — tắt minimap (bản đồ thu nhỏ bên phải)
// scrollbar — thanh cuộn ngang dày 4px, dọc dày 8px
// selectOnLineNumbers: true — click số dòng thì select cả dòng đó
// roundedSelection: false — vùng select góc vuông không bo tròn
// readOnly: false — cho phép chỉnh sửa
// cursorStyle: "line" — con trỏ dạng đường thẳng đứng
// automaticLayout: true — tự resize khi container thay đổi kích thước
// wordWrap: "on" — tự động xuống dòng khi text dài
// wrappingIndent: "same" — dòng wrap giữ cùng mức indent với dòng gốc

export const options: MonacoEditorProps["options"] = {
  autoIndent: "full",
  contextmenu: true,
  // fontFamily: "monospace",
  // fontSize: 13,
  // lineHeight: 24,
  hideCursorInOverviewRuler: true,
  matchBrackets: "always",
  minimap: {
    enabled: false,
  },
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 8,
  },
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: "line",
  automaticLayout: true,
  wordWrap: "on",
  wrappingIndent: "same",
};
