import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "calai는 사용자의 개인정보를 수집하지 않습니다. 모든 계산은 브라우저에서 처리되며, 입력 데이터는 서버로 전송되지 않습니다.",
  alternates: { canonical: "https://calai.kr/privacy" },
};

export default function PrivacyPage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 prose prose-slate">
      <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block no-underline">
        ← 홈으로
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">개인정보 처리방침</h1>
      <p className="text-sm text-slate-500 mt-2">최종 업데이트: {today}</p>

      <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. 수집하는 개인정보</h2>
          <p>
            calai는 사용자가 직접 제공하는 개인정보를 <strong>수집하지 않습니다</strong>.
            모든 계산은 사용자의 브라우저에서 처리되며, 입력하신 키·체중·금액·생년월일 등 모든 데이터는 서버로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. 자동 수집 정보</h2>
          <p>웹사이트 운영을 위해 다음 정보가 자동 수집될 수 있습니다.</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>접속 IP 주소 (호스팅 서버 로그)</li>
            <li>브라우저 종류·버전·운영체제</li>
            <li>방문 페이지·체류 시간 (Google Analytics)</li>
            <li>유입 경로·검색어 (Search Console)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. 쿠키 및 광고</h2>
          <p>
            본 사이트는 사용자 경험 개선과 광고 게재를 위해 다음 쿠키를 사용할 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Google AdSense</strong>: 맞춤형 광고 게재. 사용자는 <a href="https://adssettings.google.com" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">Google 광고 설정</a>에서 맞춤형 광고를 끌 수 있습니다.</li>
            <li><strong>Google Analytics</strong>: 익명 통계 분석. <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">옵트아웃 가능</a>.</li>
            <li><strong>필수 쿠키</strong>: 다크모드 설정·언어 등 사용자 기본 설정 저장.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. 외부 서비스 연동</h2>
          <p>다음 외부 API를 사용해 실시간 데이터를 제공합니다 (사용자 데이터는 전송하지 않음).</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Frankfurter API</strong> (ECB 환율 데이터)</li>
            <li><strong>Upbit API</strong> (가상화폐 시세)</li>
            <li><strong>Vercel</strong> (호스팅 + CDN)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. 정보주체의 권리</h2>
          <p>
            본 사이트는 개인정보를 직접 수집하지 않으므로 별도의 열람·정정·삭제 요청 절차는 없습니다.
            Google 광고·분석 관련 데이터는 위 서비스의 자체 옵트아웃 페이지를 통해 관리할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. 만 14세 미만 아동</h2>
          <p>
            본 사이트는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
            관련 우려 사항은{" "}
            <Link href="/contact" className="text-indigo-600 hover:underline">
              문의 페이지
            </Link>
            로 연락 부탁드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. 개인정보 보호책임자</h2>
          <p>
            본 사이트의 개인정보 보호 관련 문의는{" "}
            <Link href="/contact" className="text-indigo-600 hover:underline">
              문의 페이지
            </Link>
            로 연락 부탁드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. 처리방침 변경</h2>
          <p>
            본 처리방침의 변경 사항은 본 페이지에 공지되며, 중요한 변경 시 사이트 상단에 별도 알림을 표시합니다.
          </p>
        </section>
      </div>
    </article>
  );
}
