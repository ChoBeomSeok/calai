"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const GRADE_45: Record<string, number> = { "A+": 4.5, "A0": 4.0, "B+": 3.5, "B0": 3.0, "C+": 2.5, "C0": 2.0, "D+": 1.5, "D0": 1.0, "F": 0 };
const GRADE_43: Record<string, number> = { "A+": 4.3, "A0": 4.0, "A-": 3.7, "B+": 3.3, "B0": 3.0, "B-": 2.7, "C+": 2.3, "C0": 2.0, "C-": 1.7, "D+": 1.3, "D0": 1.0, "F": 0 };

type Course = { id: number; credit: number; grade: string };

export default function GpaPage() {
  const [scale, setScale] = useState<"4.5" | "4.3">("4.5");
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, credit: 3, grade: "A0" },
    { id: 2, credit: 3, grade: "B+" },
    { id: 3, credit: 3, grade: "A+" },
  ]);

  const map = scale === "4.5" ? GRADE_45 : GRADE_43;
  const max = scale === "4.5" ? 4.5 : 4.3;

  const result = useMemo(() => {
    let totalCredit = 0;
    let totalPoint = 0;
    courses.forEach((c) => {
      const cr = c.credit || 0;
      const pt = map[c.grade] ?? 0;
      totalCredit += cr;
      totalPoint += cr * pt;
    });
    if (totalCredit === 0) return null;
    const gpa = totalPoint / totalCredit;
    const percent = (gpa / max) * 100;
    return { gpa, totalCredit, percent };
  }, [courses, map, max]);

  const updateCourse = (id: number, key: "credit" | "grade", val: string | number) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [key]: val } : c)));
  };

  return (
    <CalculatorLayout title="학점 (GPA) 계산기" description="과목별 학점·등급으로 누적 평점을 4.5/4.3 척도 + 100점 환산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(["4.5", "4.3"] as const).map((s) => (
            <button key={s} onClick={() => setScale(s)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${scale === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s} 만점</button>
          ))}
        </div>
        <div className="space-y-2">
          {courses.map((c) => (
            <div key={c.id} className="grid grid-cols-3 gap-2">
              <div className="text-xs text-slate-500 self-center">과목 {c.id}</div>
              <div className="relative">
                <input type="number"
                min="0" value={c.credit} onChange={(e) => updateCourse(c.id, "credit", parseInt(e.target.value) || 0)} className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none" placeholder="학점" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">학점</span>
              </div>
              <select value={c.grade} onChange={(e) => updateCourse(c.id, "grade", e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none">
                {Object.keys(map).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setCourses([...courses, { id: courses.length + 1, credit: 3, grade: "A0" }])} className="flex-1 px-3 py-2 rounded-lg border border-dashed border-indigo-300 text-indigo-600 text-sm hover:bg-indigo-50">+ 과목 추가</button>
          {courses.length > 1 && (
            <button onClick={() => setCourses(courses.slice(0, -1))} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50">- 삭제</button>
          )}
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">평점 (GPA)</div>
              <div className="text-4xl font-bold text-indigo-900">{result.gpa.toFixed(2)} <span className="text-xl text-indigo-600">/ {max}</span></div>
              <div className="text-sm text-indigo-700 mt-2">100점 환산 약 {result.percent.toFixed(1)}점 · 총 {result.totalCredit} 학점</div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
