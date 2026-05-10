export function MoneyHint({ value, suffix = "원" }: { value: string; suffix?: string }) {
  const n = parseFloat(value);
  if (!n || n <= 0 || isNaN(n)) return null;
  return (
    <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
      {new Intl.NumberFormat("ko-KR").format(Math.round(n))} {suffix}
    </span>
  );
}
