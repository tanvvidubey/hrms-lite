export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    danger: "bg-red-50 text-red-700",
    warning: "bg-amber-50 text-amber-700",
  };
  const style = variants[variant] || variants.default;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}
    >
      {children}
    </span>
  );
}
