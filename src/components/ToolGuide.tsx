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
  if (!guide.intro && !guide.formula && !guide.whenToUse && !guide.tips && !guide.faq) {
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
