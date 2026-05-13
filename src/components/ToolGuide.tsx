import { toolGuides, getCategoryFallback, type ToolGuide as ToolGuideData } from "@/lib/toolGuides";
import { tools } from "@/lib/tools";

type Props = {
  title: string;
};

function SectionHeading({ num, title }: { num: string; eyebrow?: string; title: string }) {
  return (
    <header className="mb-6 flex items-baseline gap-4">
      <span className="text-slate-400 dark:text-slate-500 shrink-0 tabular-nums" style={{ fontFamily: "var(--font-roboto), sans-serif", fontWeight: 300, fontSize: "26px", lineHeight: 1, letterSpacing: "-0.02em" }}>
        {num}
      </span>
      <h3 className="text-[24px] sm:text-[28px] tracking-tight text-slate-900 dark:text-slate-100 leading-[1.3]" style={{ fontFamily: "var(--font-playfair), var(--font-roboto), 'Noto Sans KR', 'Pretendard', serif", fontWeight: 900 }}>{title}</h3>
    </header>
  );
}

export default function ToolGuide({ title }: Props) {
  const tool = tools.find((t) => t.title === title);
  if (!tool) return null;

  const slugKey = tool.slug.replace(/^\//, "");
  const guide: ToolGuideData = toolGuides[slugKey] || getCategoryFallback(tool.category, tool.title);

  if (!guide.intro && !guide.formula && !guide.whenToUse && !guide.tips && !guide.faq && !guide.examples && !guide.mistakes && !guide.timeline && !guide.advanced) {
    return null;
  }

  const faqJsonLd = guide.faq && guide.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  let counter = 0;
  const next = () => String(++counter).padStart(2, "0");

  return (
    <section
      className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800"
      style={{ fontFamily: "var(--font-roboto), 'Noto Sans KR', 'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}
    >
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="mb-12">
        <div className="text-[12px] text-slate-500 dark:text-slate-400 mb-2">{tool.category} · 가이드</div>
        <h2 className="text-[34px] sm:text-[42px] tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]" style={{ fontFamily: "var(--font-playfair), var(--font-roboto), 'Noto Sans KR', 'Pretendard', serif", fontWeight: 900 }}>
          {tool.shortTitle} 완벽 정리
        </h2>
      </div>

      {guide.intro && (
        <p className="text-lg leading-[1.9] text-slate-700 dark:text-slate-300 mb-16 max-w-prose
                      [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-slate-100"
           dangerouslySetInnerHTML={{ __html: guide.intro.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
        />
      )}

      {guide.formula && (
        <article className="mb-16">
          <SectionHeading num={next()} eyebrow="Formula" title="계산 공식" />
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-5 sm:px-8 py-6 sm:py-8 divide-y divide-slate-200 dark:divide-slate-800">
            {guide.formula.split(/\n{2,}/).map((block, i) => {
              const match = block.match(/^\[([^\]]+)\]\n([\s\S]+)/);
              const label = match ? match[1] : null;
              const body = match ? match[2] : block;
              return (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  {label && (
                    <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-indigo-600 dark:text-indigo-400 mb-3" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
                      {label}
                    </div>
                  )}
                  <div className="text-[15px] sm:text-[15.5px] text-slate-800 dark:text-slate-200 leading-[1.9] whitespace-pre-wrap">
                    {body}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      )}

      {guide.whenToUse && guide.whenToUse.length > 0 && (
        <article className="mb-16">
          <SectionHeading num={next()} eyebrow="Use cases" title="언제 사용하나요" />
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
            {guide.whenToUse.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-slate-400 dark:text-slate-500 pt-0.5 shrink-0 tabular-nums" style={{ fontFamily: "var(--font-roboto), sans-serif", fontWeight: 300, fontSize: "15px", lineHeight: 1.4 }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      )}

      {guide.tips && guide.tips.length > 0 && (
        <article className="mb-16">
          <SectionHeading num={next()} eyebrow="Tips" title="알아두면 좋은 점" />
          <ul className="space-y-3 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 pl-4 border-l-2 border-emerald-300 dark:border-emerald-700/60 py-1">
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </article>
      )}

      {guide.examples && guide.examples.length > 0 && (
        <article className="mb-16">
          <SectionHeading num={next()} eyebrow="Case studies" title="실제 계산 사례" />
          <div className="space-y-6">
            {guide.examples.map((ex, i) => (
              <figure key={i} className="rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-indigo-600 dark:text-indigo-400 mb-2" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
                    사례 {String(i + 1).padStart(2, "0")}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">{ex.title}</h4>
                  <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{ex.scenario}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/80 px-5 sm:px-6 py-5 divide-y divide-slate-200 dark:divide-slate-800">
                  {ex.calculation.split(/\n{2,}/).map((block, k) => {
                    const m = block.match(/^\[([^\]]+)\]\n([\s\S]+)/);
                    const label = m ? m[1] : null;
                    const body = m ? m[2] : block;
                    return (
                      <div key={k} className="py-3 first:pt-0 last:pb-0">
                        {label && (
                          <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-slate-500 dark:text-slate-400 mb-1.5" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
                            {label}
                          </div>
                        )}
                        <div className="text-[14px] text-slate-700 dark:text-slate-300 leading-[1.85] whitespace-pre-wrap">
                          {body}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <figcaption className="px-5 sm:px-6 py-4 bg-indigo-50/60 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900/50 text-[15px] font-semibold text-indigo-900 dark:text-indigo-300">
                  → {ex.result}
                </figcaption>
              </figure>
            ))}
          </div>
        </article>
      )}

      {guide.mistakes && guide.mistakes.length > 0 && (
        <article className="mb-16">
          <SectionHeading num={next()} title="자주 하는 실수" />
          <div className="space-y-7">
            {guide.mistakes.map((m, i) => (
              <div key={i} className="grid grid-cols-[44px_1fr] gap-x-4">
                <span className="text-slate-400 dark:text-slate-500 pt-1 tabular-nums" style={{ fontFamily: "var(--font-roboto), sans-serif", fontWeight: 300, fontSize: "26px", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2.5">
                    {m.mistake}
                  </p>
                  <p className="text-[14.5px] text-slate-600 dark:text-slate-400 leading-[1.85] pl-4 border-l border-emerald-300 dark:border-emerald-700/60">
                    {m.correct}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      )}

      {guide.timeline && guide.timeline.length > 0 && (
        <article className="mb-16">
          <SectionHeading num={next()} eyebrow="Timeline" title="시기·일정" />
          <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-6">
            {guide.timeline.map((t, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[27px] top-2.5 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 ring-4 ring-slate-50 dark:ring-slate-950" />
                <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">{t.period}</div>
                <div className="text-[14.5px] text-slate-600 dark:text-slate-400 leading-[1.75]">{t.action}</div>
              </div>
            ))}
          </div>
        </article>
      )}

      {guide.advanced && guide.advanced.length > 0 && (
        <article className="mb-16">
          <SectionHeading num={next()} eyebrow="Deep dive" title="심화 정보" />
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {guide.advanced.map((a, i) => (
              <div key={i} className="py-5 first:pt-0 last:pb-0">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">{a.heading}</h4>
                <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-[1.85]">{a.body}</p>
              </div>
            ))}
          </div>
        </article>
      )}

      {guide.faq && guide.faq.length > 0 && (
        <article className="mb-4">
          <SectionHeading num={next()} eyebrow="FAQ" title="자주 묻는 질문" />
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {guide.faq.map((item, i) => (
              <details key={i} className="group py-1">
                <summary className="py-4 cursor-pointer list-none flex items-start justify-between gap-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <span className="flex items-baseline gap-3 text-[15px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0 tabular-nums" style={{ fontFamily: "var(--font-roboto), sans-serif", fontWeight: 300, fontSize: "16px", lineHeight: 1.2 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 pt-1">▾</span>
                </summary>
                <p className="pb-5 pl-10 pr-4 text-[15px] text-slate-600 dark:text-slate-400 leading-[1.85]">{item.a}</p>
              </details>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
