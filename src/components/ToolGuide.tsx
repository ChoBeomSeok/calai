import { toolGuides, getCategoryFallback, type ToolGuide as ToolGuideData } from "@/lib/toolGuides";
import { tools } from "@/lib/tools";

type Props = {
  title: string;
};

export default function ToolGuide({ title }: Props) {
  const tool = tools.find((t) => t.title === title);
  if (!tool) return null;

  const slugKey = tool.slug.replace(/^\//, "");
  const guide: ToolGuideData = toolGuides[slugKey] || getCategoryFallback(tool.category, tool.title);

  // 가이드 콘텐츠 없으면 표시 X
  if (!guide.intro && !guide.formula && !guide.whenToUse && !guide.tips && !guide.faq && !guide.examples && !guide.mistakes && !guide.timeline && !guide.advanced) {
    return null;
  }

  // FAQ Schema (JSON-LD) — Google 검색 결과 풍부 표시
  const faqJsonLd = guide.faq && guide.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  } : null;

  return (
    <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-700">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span>📖</span> {tool.shortTitle} 가이드
      </h2>

      {guide.intro && (
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">{guide.intro}</p>
      )}

      {guide.formula && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">계산 공식</h3>
          <pre className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
            {guide.formula}
          </pre>
        </div>
      )}

      {guide.whenToUse && guide.whenToUse.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">언제 사용하나요</h3>
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {guide.whenToUse.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {guide.tips && guide.tips.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">사용 팁</h3>
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 mt-0.5">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {guide.examples && guide.examples.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">📊 실제 계산 사례</h3>
          <div className="space-y-3">
            {guide.examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30 p-4">
                <div className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">사례 {i + 1}: {ex.title}</div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{ex.scenario}</p>
                <pre className="text-xs font-mono bg-white dark:bg-slate-900 rounded p-2 mb-2 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{ex.calculation}</pre>
                <div className="text-sm font-bold text-indigo-700 dark:text-indigo-400">→ {ex.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {guide.mistakes && guide.mistakes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">⚠️ 자주 하는 실수</h3>
          <div className="space-y-2">
            {guide.mistakes.map((m, i) => (
              <div key={i} className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/30 p-3">
                <div className="text-sm text-rose-700 dark:text-rose-400 mb-1"><strong>❌ 실수:</strong> {m.mistake}</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-400"><strong>✓ 정답:</strong> {m.correct}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {guide.timeline && guide.timeline.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">📅 시기·일정</h3>
          <div className="space-y-1.5">
            {guide.timeline.map((t, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="font-semibold text-amber-700 dark:text-amber-400 min-w-[100px]">{t.period}</div>
                <div className="text-slate-700 dark:text-slate-300 flex-1">{t.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {guide.advanced && guide.advanced.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">🎯 심화 정보·절세 전략</h3>
          <div className="space-y-3">
            {guide.advanced.map((a, i) => (
              <div key={i} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">{a.heading}</div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {guide.faq && guide.faq.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">자주 묻는 질문</h3>
          <div className="space-y-3">
            {guide.faq.map((item, i) => (
              <details
                key={i}
                className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 group"
              >
                <summary className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer list-none flex items-center justify-between">
                  <span>Q. {item.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">A. {item.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
