import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors"
        >
          cal<span className="text-indigo-600 dark:text-indigo-400">ai</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            홈
          </Link>
          <Link href="/#tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            도구
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
