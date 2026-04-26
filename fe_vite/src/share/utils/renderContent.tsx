import katex from "katex";
import "katex/dist/katex.min.css";

// Syntax hỗ trợ:
//   $$latex$$          → render công thức KaTeX (inline)
//   [img:$https://...$] → render ảnh từ Cloudinary URL

const renderContent = (text: string): React.ReactNode[] => {
  // Tách theo cả 2 pattern: $$math$$ và [img:$url$]
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\[img:\$[^\$]+\$\])/g);

  return parts.map((part, i) => {
    // ── Công thức toán học
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const latex = part.slice(2, -2);
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: false,
        });
        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch {
        return (
          <span key={i} className="text-red-400">
            {part}
          </span>
        );
      }
    }

    // ── Hình ảnh từ Cloudinary
    // Syntax: [img:$https://res.cloudinary.com/...$]
    if (part.startsWith("[img:$") && part.endsWith("$]")) {
      const url = part.slice(6, -2).trim();
      return (
        <span key={i} className="my-1 block">
          <img
            src={url}
            alt="exam-image"
            className="max-h-64 max-w-full rounded border border-gray-200 object-contain"
            onError={(e) => {
              // fallback nếu URL lỗi
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </span>
      );
    }

    // ── Text thường
    return <span key={i}>{part}</span>;
  });
};

export default renderContent;
