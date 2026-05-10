"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("calai-theme") as "light" | "dark" | null;
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("calai-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="테마 전환"
      title={theme === "light" ? "다크 모드" : "라이트 모드"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
