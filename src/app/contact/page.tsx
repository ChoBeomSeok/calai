import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "문의하기",
  description: "calai 도구 추가 요청·오류 신고·제휴 문의는 이메일로 보내주세요.",
  alternates: { canonical: "https://www.calai.kr/contact" },
};

const CONTACT_EMAIL = "petandme99@gmail.com";

export default function ContactPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block">
        ← 홈으로
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">문의하기</h1>
      <p className="mt-4 text-lg text-slate-600 leading-relaxed">
        도구 추가 요청·계산 오류 신고·제휴 문의 등 모든 연락은 아래 이메일로 보내주세요.
      </p>

      <div className="mt-10 rounded-2xl bg-indigo-50 p-6 sm:p-8 text-center">
        <div className="text-sm text-indigo-700 mb-2">이메일</div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-2xl sm:text-3xl font-bold text-indigo-900 hover:text-indigo-700 transition"
        >
          {CONTACT_EMAIL}
        </a>
        <div className="text-xs text-indigo-700 mt-3">평일 24~48시간 안 답변 드립니다.</div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-900">Q. 새 도구를 추가해 주실 수 있나요?</div>
            <p className="mt-2 text-slate-700 text-sm">
              네, 도구 이름·계산식·예상 사용 시나리오를 이메일로 보내 주시면 검토 후 추가합니다.
              한국 사용자 검색량이 많은 도구일수록 우선 추가됩니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-900">Q. 계산 결과가 다른 사이트와 다릅니다.</div>
            <p className="mt-2 text-slate-700 text-sm">
              세금·금융 계산은 정책·요율 갱신 시점에 따라 차이가 날 수 있습니다.
              구체적인 입력값과 차이 내용을 이메일로 보내 주시면 확인 후 수정하겠습니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-900">Q. 광고가 너무 많거나 불편합니다.</div>
            <p className="mt-2 text-slate-700 text-sm">
              사용 경험을 해치지 않는 위치·빈도로 운영하려고 노력합니다. 구체적 위치·문제 알려 주시면 즉시 조정 검토합니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-900">Q. 제휴·광고·B2B 문의는 어디로?</div>
            <p className="mt-2 text-slate-700 text-sm">
              위 이메일로 회사명·연락처·제안 내용을 보내 주세요. 영업일 기준 1~3일 안 답변 드립니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-900">Q. 개인정보가 수집되나요?</div>
            <p className="mt-2 text-slate-700 text-sm">
              모든 계산은 브라우저에서 처리되어 입력 데이터는 서버로 전송되지 않습니다.
              자세한 내용은{" "}
              <Link href="/privacy" className="text-indigo-600 hover:underline">개인정보 처리방침</Link>
              을 참고해 주세요.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
