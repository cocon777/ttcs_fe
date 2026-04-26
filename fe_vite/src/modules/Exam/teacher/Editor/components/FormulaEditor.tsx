import { X } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useRef, useState } from "react";

interface FormulaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (formula: string) => void;
}

type Tab = "123" | "f()" | "∞≠∈" | "ABC" | "αβγ";
const TABS: Tab[] = ["123", "f()", "∞≠∈", "ABC", "αβγ"];

interface Sym {
  label: string;
  insert: string;
  cursorBack?: number; // số ký tự lùi con trỏ sau khi insert (để đặt cursor vào trong {})
}

const SYMBOLS: Record<Tab, Sym[]> = {
  "123": [
    { label: "x", insert: "x" },
    { label: "n", insert: "n" },
    { label: "7", insert: "7" },
    { label: "8", insert: "8" },
    { label: "9", insert: "9" },
    { label: "÷", insert: "\\div " },
    { label: "e", insert: "e" },
    { label: "i", insert: "i" },
    { label: "π", insert: "\\pi " },
    { label: "<", insert: "<" },
    { label: ">", insert: ">" },
    { label: "4", insert: "4" },
    { label: "5", insert: "5" },
    { label: "6", insert: "6" },
    { label: "×", insert: "\\times " },
    { label: "□²", insert: "^{2}" },
    { label: "x^□", insert: "^{}", cursorBack: 1 },
    { label: "√□", insert: "\\sqrt{}", cursorBack: 1 },
    { label: "(", insert: "(" },
    { label: ")", insert: ")" },
    { label: "1", insert: "1" },
    { label: "2", insert: "2" },
    { label: "3", insert: "3" },
    { label: "−", insert: "-" },
    { label: "∫", insert: "\\int " },
    { label: "∀", insert: "\\forall " },
    { label: "0", insert: "0" },
    { label: ".", insert: "." },
    { label: "=", insert: "=" },
    { label: "+", insert: "+" },
  ],
  "f()": [
    { label: "sin", insert: "\\sin(" },
    { label: "sin⁻¹", insert: "\\sin^{-1}(" },
    { label: "ln", insert: "\\ln(" },
    { label: "eˣ", insert: "e^{}", cursorBack: 1 },
    { label: "lcm()", insert: "\\operatorname{lcm}()" },
    { label: "ceil()", insert: "\\lceil\\rceil", cursorBack: 6 },
    { label: "lim", insert: "\\lim_{}", cursorBack: 1 },
    { label: "∫", insert: "\\int " },
    { label: "abs()", insert: "\\left|\\right|", cursorBack: 7 },
    { label: "cos", insert: "\\cos(" },
    { label: "cos⁻¹", insert: "\\cos^{-1}(" },
    { label: "log", insert: "\\log(" },
    { label: "10ˣ", insert: "10^{}", cursorBack: 1 },
    { label: "gcd()", insert: "\\gcd()" },
    { label: "floor()", insert: "\\lfloor\\rfloor", cursorBack: 7 },
    { label: "Σ", insert: "\\sum_{n=0}^{\\infty}" },
    { label: "∫₀^∞", insert: "\\int_0^{\\infty}" },
    { label: "sign()", insert: "\\operatorname{sign}()" },
    { label: "tan", insert: "\\tan(" },
    { label: "tan⁻¹", insert: "\\tan^{-1}(" },
    { label: "logₙ", insert: "\\log_{}", cursorBack: 1 },
    { label: "ⁿ√□", insert: "\\sqrt[]{}", cursorBack: 3 },
    { label: "mod", insert: "\\bmod " },
    { label: "round()", insert: "\\operatorname{round}()" },
    { label: "Π", insert: "\\prod_{n=0}^{\\infty}" },
    { label: "d/dx", insert: "\\frac{d}{dx}" },
    { label: "(", insert: "(" },
    { label: ")", insert: ")" },
    { label: "xˢ", insert: "^{}", cursorBack: 1 },
    { label: "xₛ", insert: "_{}", cursorBack: 1 },
  ],
  "∞≠∈": [
    { label: "7", insert: "7" },
    { label: "8", insert: "8" },
    { label: "9", insert: "9" },
    { label: "÷", insert: "\\div " },
    { label: "{", insert: "\\{" },
    { label: "}", insert: "\\}" },
    { label: "←", insert: "\\leftarrow " },
    { label: "→", insert: "\\rightarrow " },
    { label: "overline", insert: "\\overline{}", cursorBack: 1 },
    { label: "underline", insert: "\\underline{}", cursorBack: 1 },
    { label: "ceil", insert: "\\lceil\\rceil", cursorBack: 6 },
    { label: "∇", insert: "\\nabla " },
    { label: "∞", insert: "\\infty " },
    { label: "4", insert: "4" },
    { label: "5", insert: "5" },
    { label: "6", insert: "6" },
    { label: "×", insert: "\\times " },
    { label: "[", insert: "[" },
    { label: "]", insert: "]" },
    { label: "∈", insert: "\\in " },
    { label: "∉", insert: "\\notin " },
    { label: "ℜ", insert: "\\Re " },
    { label: "ℑ", insert: "\\Im " },
    { label: "⌊⌋", insert: "\\lfloor\\rfloor", cursorBack: 7 },
    { label: "∂", insert: "\\partial " },
    { label: "∅", insert: "\\emptyset " },
    { label: "1", insert: "1" },
    { label: "2", insert: "2" },
    { label: "3", insert: "3" },
    { label: "−", insert: "-" },
    { label: "⊂", insert: "\\subset " },
    { label: "⊃", insert: "\\supset " },
    { label: "vec", insert: "\\vec{}", cursorBack: 1 },
    { label: "|x|", insert: "\\left|\\right|", cursorBack: 7 },
    { label: "!", insert: "!" },
    { label: "0", insert: "0" },
    { label: ".", insert: "." },
    { label: "=", insert: "=" },
    { label: "+", insert: "+" },
    { label: "·", insert: "\\cdot " },
    { label: ":", insert: ":" },
    { label: "○", insert: "\\circ " },
    { label: "≈", insert: "\\approx " },
    { label: "≠", insert: "\\neq " },
    { label: "±", insert: "\\pm " },
  ],
  ABC: [
    ..."abcdefghijklmnopqrstuvwxyz"
      .split("")
      .map((c) => ({ label: c, insert: c })),
    ..."0123456789".split("").map((c) => ({ label: c, insert: c })),
    { label: "+", insert: "+" },
    { label: "−", insert: "-" },
    { label: "×", insert: "\\times " },
    { label: "÷", insert: "\\div " },
    { label: "=", insert: "=" },
    { label: ".", insert: "." },
  ],
  αβγ: [
    { label: "φ", insert: "\\varphi " },
    { label: "ς", insert: "\\varsigma " },
    { label: "ε", insert: "\\epsilon " },
    { label: "ρ", insert: "\\rho " },
    { label: "τ", insert: "\\tau " },
    { label: "υ", insert: "\\upsilon " },
    { label: "θ", insert: "\\theta " },
    { label: "ι", insert: "\\iota " },
    { label: "ο", insert: "o" },
    { label: "π", insert: "\\pi " },
    { label: "α", insert: "\\alpha " },
    { label: "σ", insert: "\\sigma " },
    { label: "δ", insert: "\\delta " },
    { label: "φ", insert: "\\phi " },
    { label: "γ", insert: "\\gamma " },
    { label: "η", insert: "\\eta " },
    { label: "ξ", insert: "\\xi " },
    { label: "κ", insert: "\\kappa " },
    { label: "λ", insert: "\\lambda " },
    { label: "ζ", insert: "\\zeta " },
    { label: "χ", insert: "\\chi " },
    { label: "ψ", insert: "\\psi " },
    { label: "ω", insert: "\\omega " },
    { label: "β", insert: "\\beta " },
    { label: "ν", insert: "\\nu " },
    { label: "μ", insert: "\\mu " },
    { label: "ε̃", insert: "\\varepsilon " },
    { label: "ϑ", insert: "\\vartheta " },
    { label: "ϰ", insert: "\\varkappa " },
    { label: "ϖ", insert: "\\varpi " },
    { label: "ϱ", insert: "\\varrho " },
  ],
};

const FormulaEditor: React.FC<FormulaEditorProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("123");
  const [formula, setFormula] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  // Render preview bằng KaTeX, nếu lỗi thì hiện text thường
  const renderPreview = () => {
    if (!formula.trim()) return "";
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return formula;
    }
  };

  // Insert ký hiệu vào vị trí con trỏ trong textarea
  const insertAtCursor = (insert: string, cursorBack = 0) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newVal = formula.slice(0, start) + insert + formula.slice(end);
    setFormula(newVal);
    setTimeout(() => {
      const pos = start + insert.length - cursorBack;
      el.setSelectionRange(pos, pos);
      el.focus();
    }, 0);
  };

  const handleInsert = () => {
    if (!formula.trim()) return;
    onInsert(`$$${formula}$$`);
    setFormula("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">
            Soạn thảo công thức
          </span>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Preview area */}
        <div className="min-h-[64px] border-b border-gray-200 bg-white px-4 py-3">
          {formula.trim() ? (
            <div
              className="flex items-center justify-start overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          ) : (
            <div className="text-sm text-gray-400">
              Công thức sẽ hiện ở đây...
            </div>
          )}
        </div>

        {/* Hidden textarea để track cursor */}
        <textarea
          ref={textareaRef}
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="w-full resize-none border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700 outline-none"
          rows={2}
          placeholder="Nhập LaTeX hoặc dùng bàn phím bên dưới..."
        />

        {/* Nút Chèn */}
        <div className="flex justify-end border-b border-gray-200 px-4 py-2">
          <button
            onClick={handleInsert}
            className="rounded bg-blue-700 px-6 py-1.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={!formula.trim()}
          >
            Chèn
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Symbol keyboard */}
        <div className="flex flex-wrap gap-1.5 bg-gray-100 p-3">
          {SYMBOLS[activeTab].map((sym, idx) => (
            <button
              key={idx}
              onClick={() => insertAtCursor(sym.insert, sym.cursorBack)}
              className="min-w-[40px] rounded border border-gray-300 bg-white px-2 py-1.5 text-center text-sm text-gray-700 shadow-sm hover:bg-gray-50 hover:border-blue-400 transition-colors"
            >
              {sym.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;
