interface SectionBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const SectionBox = ({
  title,
  children,
  className,
  titleClassName,
}: SectionBoxProps) => {
  return (
    <fieldset
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <legend
        className={`px-2 text-sm font-semibold text-slate-700 ${titleClassName ?? ""}`}
      >
        {title}
      </legend>

      {children}
    </fieldset>
  );
};

export default SectionBox;
