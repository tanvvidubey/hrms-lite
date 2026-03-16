export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-16 sm:py-24 ${className}`}>
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}
