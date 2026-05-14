type Props = {
  label?: string;
  current?: number;
  total?: number;
  indeterminate?: boolean;
};

export default function ProgressBar({ label, current, total, indeterminate }: Props) {
  const pct = !indeterminate && total && total > 0
    ? Math.min(100, Math.round(((current ?? 0) / total) * 100))
    : null;

  return (
    <div className="mt-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/40 px-5 py-4">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-semibold text-indigo-900 dark:text-indigo-200">
          {label ?? "처리 중..."}
        </span>
        {pct !== null && (
          <span className="text-indigo-700 dark:text-indigo-400 tabular-nums font-medium">
            {pct}%
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 overflow-hidden">
        {pct !== null ? (
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        ) : (
          <div className="h-full w-1/3 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-[slide_1.5s_ease-in-out_infinite]" />
        )}
      </div>
      <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
    </div>
  );
}
