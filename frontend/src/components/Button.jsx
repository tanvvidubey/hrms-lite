export default function Button({ children, variant = "primary", disabled, type = "button", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] sm:min-h-0";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const style = variants[variant] || variants.primary;
  return (
    <button type={type} disabled={disabled} className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
}
