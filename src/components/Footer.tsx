import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-sm font-bold text-slate-900 mb-3">calai</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              한국에서 가장 빠른 도구·계산기 98개를 한 페이지에. PDF·이미지·실업급여·마크다운·SQL 포매터 모두 무료.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">서비스</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-indigo-600 transition">홈</Link></li>
              <li><Link href="/#tools" className="text-slate-600 hover:text-indigo-600 transition">전체 도구</Link></li>
              <li><Link href="/about" className="text-slate-600 hover:text-indigo-600 transition">소개</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">정책</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-slate-600 hover:text-indigo-600 transition">개인정보 처리방침</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-indigo-600 transition">이용약관</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">연락</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-slate-600 hover:text-indigo-600 transition">문의하기</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 leading-relaxed space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>© {new Date().getFullYear()} calai. All rights reserved.</div>
            <div>한국에서 가장 빠른 도구·계산기</div>
          </div>
          <p className="text-xs text-slate-400">
            본 사이트의 계산 결과는 참고용이며, 실제 세무·금융·의료 결정은 전문가 상담을 통해 진행하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
