import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "calai 소개",
  description: "calai는 한국에서 자주 쓰는 도구·계산기 106개+를 한 페이지에 모은 완전 무료 사이트입니다. PDF·이미지·실업급여·전세사기·마크다운·SQL 포매터·Cron 해석까지 모두 무료, 가입·로그인 없이 즉시 사용.",
  alternates: { canonical: "https://www.calai.kr/about" },
};

export default function AboutPage() {
  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block">
        ← 홈으로
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">calai 소개</h1>
      <p className="mt-4 text-lg text-slate-600 leading-relaxed">
        한국에서 가장 자주 검색되는 도구·계산기 {tools.length}개를 한 페이지에 모은 무료 서비스입니다.
        가입·로그인 없이 즉시 사용 가능, 모든 계산은 브라우저에서 처리되어 빠르고 깔끔합니다.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">미션</h2>
        <p className="text-slate-700 leading-relaxed">
          한국 사용자가 일상에서 마주치는 계산·변환·생성 작업을 한 곳에서 빠르게 끝낼 수 있도록 합니다.
          광고 도배 없이 깔끔한 UX, 빠른 로딩, 정확한 계산식 — 세 가지 원칙으로 운영합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">제공 도구 ({tools.length}개)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat).length;
            return (
              <div key={cat} className="rounded-lg bg-slate-50 p-3 text-center">
                <div className="font-semibold text-slate-800">{cat}</div>
                <div className="text-xs text-slate-500 mt-1">{count}개 도구</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">차별점</h2>
        <ul className="space-y-3 text-slate-700">
          <li>
            <strong>빠른 로딩</strong> — Next.js 정적 사이트로 0.3~1초 안 페이지 표시
          </li>
          <li>
            <strong>실시간 데이터</strong> — 환율(ECB)·코인 시세(업비트)·세계 시간 자동 갱신
          </li>
          <li>
            <strong>광고 최소화</strong> — 도구 사용을 방해하지 않는 위치·빈도
          </li>
          <li>
            <strong>한국 특화</strong> — 청약 가점·LTV/DTI·취득세·종부세·만 나이 등 한국 사용자 전용 도구
          </li>
          <li>
            <strong>개인정보 보호</strong> — 모든 계산은 브라우저에서 처리, 입력 데이터는 서버로 전송되지 않음
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">계산식·데이터 출처</h2>
        <p className="text-slate-700 leading-relaxed">
          한국 국세청·한국은행·통계청·한국비만학회·기획재정부 등 공식 자료를 바탕으로 계산식을 구현합니다.
          실시간 데이터는 ECB(환율)·업비트(코인) 등 신뢰 가능한 공개 API를 사용합니다.
          모든 결과는 참고용이며, 법적·재무적·의료적 결정은 전문가 상담을 권장합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">연락처</h2>
        <p className="text-slate-700">
          제휴·문의·도구 추가 요청은{" "}
          <Link href="/contact" className="text-indigo-600 hover:underline">
            문의 페이지
          </Link>{" "}
          를 이용해 주세요.
        </p>
      </section>
    </article>
  );
}
