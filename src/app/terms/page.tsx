import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "calai 서비스 이용약관. 무료 도구·계산기 사용 시 적용되는 권리·의무·면책 조항.",
  alternates: { canonical: "https://calai.kr/terms" },
};

export default function TermsPage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block">
        ← 홈으로
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">이용약관</h1>
      <p className="text-sm text-slate-500 mt-2">최종 업데이트: {today}</p>

      <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제1조 (목적)</h2>
          <p>
            본 약관은 calai(이하 &quot;서비스&quot;)가 제공하는 도구·계산기 서비스의 이용 조건과 절차,
            이용자와 운영자 간의 권리·의무 및 책임 사항을 규정합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제2조 (서비스 정의)</h2>
          <p>
            서비스는 BMI·대출·세금·환율·코인 등 다양한 도구·계산기를 무료로 제공하는 웹사이트입니다.
            가입·로그인 없이 사용 가능하며, 모든 계산은 사용자의 브라우저에서 처리됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제3조 (이용 조건)</h2>
          <ul className="list-disc list-inside space-y-1.5">
            <li>본 서비스는 누구나 무료로 이용할 수 있습니다.</li>
            <li>회원가입·로그인이 필요 없으며, 개인정보를 제공하지 않습니다.</li>
            <li>모바일·데스크탑·태블릿 모든 기기에서 접속 가능합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제4조 (계산 결과의 한계 — 면책 조항)</h2>
          <p className="font-semibold text-rose-700 bg-rose-50 p-3 rounded-lg">
            ⚠ 본 서비스의 모든 계산 결과는 <strong>참고용</strong>이며, 법적·재무적·의료적 효력이 없습니다.
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-3">
            <li><strong>세금 계산기</strong> (양도세·취득세·상속세 등) — 실제 신고는 세무사·국세청 상담 필수</li>
            <li><strong>금융 계산기</strong> (대출·적금·연봉 등) — 실제 금리·세율은 금융기관 확인 필요</li>
            <li><strong>건강 계산기</strong> (BMI·칼로리·임신 주차 등) — 의료적 진단·치료 결정은 의사 상담 필수</li>
            <li><strong>부동산 계산기</strong> (청약 가점·LTV 등) — 실제 청약·대출 시 해당 기관 확인</li>
            <li><strong>실시간 데이터</strong> (환율·코인) — 실거래 시 거래소·은행 가격 별도 확인</li>
          </ul>
          <p className="mt-3">
            서비스 사용으로 인한 직접·간접 손해에 대해 운영자는 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제5조 (지적재산권)</h2>
          <p>
            서비스의 디자인·코드·텍스트·UI는 운영자의 지적재산이며, 무단 복제·재배포·상업적 이용을 금합니다.
            계산식 자체는 공개된 공식·표준에 기반하므로 자유롭게 학습·참고 가능합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제6조 (금지 사항)</h2>
          <ul className="list-disc list-inside space-y-1.5">
            <li>서비스의 자동 크롤링·스크래핑·DDoS 공격</li>
            <li>서비스를 무단으로 다른 사이트에 임베드·복제</li>
            <li>서비스를 통한 불법·유해 활동</li>
            <li>API 어뷰징 (대량 호출로 외부 서비스 부담 유발)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제7조 (광고 게재)</h2>
          <p>
            서비스 운영을 위해 Google AdSense 등 제3자 광고를 게재할 수 있습니다.
            광고 클릭·구매는 사용자 자율 결정이며, 광고주와의 거래에 대해 운영자는 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제8조 (서비스 변경·중단)</h2>
          <p>
            운영자는 서비스 개선·법적 사유 등으로 도구·콘텐츠·기능을 변경하거나 중단할 수 있습니다.
            중대한 변경 시 사이트 공지를 통해 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제9조 (준거법·관할)</h2>
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 운영자 소재지 관할 법원을 1심 관할로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">제10조 (약관 변경)</h2>
          <p>
            본 약관은 사전 공지 후 변경될 수 있으며, 변경 사항은 본 페이지에 게시된 날로부터 효력이 발생합니다.
          </p>
        </section>
      </div>
    </article>
  );
}
