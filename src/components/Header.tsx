import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
        >
          cal<span className="text-indigo-600">ai</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            홈
          </Link>
          <Link
            href="/#tools"
            className="hover:text-indigo-600 transition-colors"
          >
            도구
          </Link>
        </nav>
      </div>
    </header>
  );
}
