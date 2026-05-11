"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

type BuildingType = "apartment" | "officetel" | "villa" | "studio";

const BUILDING_LABEL: Record<BuildingType, string> = {
  apartment: "아파트",
  officetel: "오피스텔",
  villa: "빌라·다세대",
  studio: "원룸·다가구",
};

// 건축 종류별 위험도 가중치 (빌라·원룸이 가장 위험)
const BUILDING_RISK: Record<BuildingType, number> = {
  apartment: 0,
  officetel: 5,
  villa: 20,
  studio: 15,
};

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function JeonseRiskPage() {
  const [deposit, setDeposit] = useState("200000000"); // 보증금
  const [marketPrice, setMarketPrice] = useState("250000000"); // 시세·매매가
  const [mortgage, setMortgage] = useState("0"); // 근저당
  const [building, setBuilding] = useState<BuildingType>("apartment");
  const [landlordIsLandlord, setLandlordIsLandlord] = useState(true); // 등기상 임대인 = 계약 상대
  const [hugInsured, setHugInsured] = useState(false); // 임대보증보험
  const [registeredBusiness, setRegisteredBusiness] = useState(false); // 임대사업자 등록

  const result = useMemo(() => {
    const d = parseFloat(deposit);
    const m = parseFloat(marketPrice);
    const mort = parseFloat(mortgage) || 0;
    if (!d || !m || d <= 0 || m <= 0) return null;

    // 1. 전세가율 (보증금 / 시세) — 80%↑ 위험, 90%↑ 매우 위험
    const jeonseRatio = (d / m) * 100;
    let jeonseScore = 0;
    if (jeonseRatio >= 90) jeonseScore = 30;
    else if (jeonseRatio >= 80) jeonseScore = 20;
    else if (jeonseRatio >= 70) jeonseScore = 10;

    // 2. 깡통전세 위험 (보증금 + 근저당 vs 시세)
    const totalEncumbrance = d + mort;
    const encumbranceRatio = (totalEncumbrance / m) * 100;
    let encumbranceScore = 0;
    if (encumbranceRatio >= 100) encumbranceScore = 40; // 깡통전세 확실
    else if (encumbranceRatio >= 90) encumbranceScore = 30;
    else if (encumbranceRatio >= 80) encumbranceScore = 20;
    else if (encumbranceRatio >= 70) encumbranceScore = 10;

    // 3. 건축 종류 위험도
    const buildingScore = BUILDING_RISK[building];

    // 4. 등기 임대인 불일치 (대리인·명의 차용 위험)
    const identityScore = landlordIsLandlord ? 0 : 25;

    // 5. 보호 장치 (HUG 보증 / 임대사업자 등록)
    let protectionScore = 0;
    if (hugInsured) protectionScore -= 20; // 매우 안전
    if (registeredBusiness) protectionScore -= 10;

    const totalScore = Math.max(
      0,
      Math.min(100, jeonseScore + encumbranceScore + buildingScore + identityScore + protectionScore)
    );

    let level: "safe" | "caution" | "danger" | "critical";
    let levelLabel: string;
    let levelColor: string;
    let advice: string;

    if (totalScore <= 15) {
      level = "safe";
      levelLabel = "안전";
      levelColor = "emerald";
      advice = "전반적으로 안전한 계약 조건입니다. 단, 임차권 등기·확정일자·전입신고는 필수입니다.";
    } else if (totalScore <= 35) {
      level = "caution";
      levelLabel = "주의";
      levelColor = "amber";
      advice = "일부 위험 요소가 있습니다. HUG 임대보증보험 가입을 강력 권장하며, 등기부등본 직접 확인이 필요합니다.";
    } else if (totalScore <= 60) {
      level = "danger";
      levelLabel = "위험";
      levelColor = "orange";
      advice = "위험 수준이 높습니다. HUG 보증 미가입 시 계약 재검토를 권장하며, 보증금 감액·근저당 말소 요청이 필요합니다.";
    } else {
      level = "critical";
      levelLabel = "매우 위험";
      levelColor = "rose";
      advice = "깡통전세 가능성이 매우 높습니다. 계약 전 변호사·공인중개사 상담을 받으시고, HUG 보증·전세보증보험 가입이 불가능하면 계약 포기를 고려하세요.";
    }

    return {
      jeonseRatio,
      jeonseScore,
      encumbranceRatio,
      encumbranceScore,
      buildingScore,
      identityScore,
      protectionScore,
      totalScore,
      level,
      levelLabel,
      levelColor,
      advice,
    };
  }, [deposit, marketPrice, mortgage, building, landlordIsLandlord, hugInsured, registeredBusiness]);

  return (
    <CalculatorLayout
      title="전세 사기 위험도 체크"
      description="보증금·시세·근저당·건축 종류·보호 장치 5가지 지표로 깡통전세 위험도 종합 진단. 계약 전 필수 체크."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">전세 보증금 (원)</span>
            <input
              type="number"
              min="0"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
            <MoneyHint value={deposit} />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">주택 시세·매매가 (원)</span>
            <input
              type="number"
              min="0"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
            <MoneyHint value={marketPrice} />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              국토부 실거래가 또는 KB부동산 시세 — 매매가 기준
            </span>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">근저당 설정액 (등기부등본 \"을구\", 원)</span>
            <input
              type="number"
              min="0"
              value={mortgage}
              onChange={(e) => setMortgage(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
            <MoneyHint value={mortgage} />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              등기부등본 \"을구\" 항목 합계. 인터넷등기소에서 1,000원에 발급.
            </span>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">건축 종류</span>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value as BuildingType)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            >
              {Object.entries(BUILDING_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400 sm:col-span-2">
            <input type="checkbox" checked={landlordIsLandlord} onChange={(e) => setLandlordIsLandlord(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">등기부등본 \"갑구\" 소유자 = 계약 상대 (집주인 본인)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 sm:col-span-2 bg-emerald-50/30 dark:bg-emerald-950/30">
            <input type="checkbox" checked={hugInsured} onChange={(e) => setHugInsured(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">HUG·SGI 전세보증보험 가입 가능</span>
            <span className="text-xs text-emerald-700 ml-auto">→ 가입 시 보증금 100% 보호</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 sm:col-span-2 bg-emerald-50/30 dark:bg-emerald-950/30">
            <input type="checkbox" checked={registeredBusiness} onChange={(e) => setRegisteredBusiness(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">임대인이 \"주택임대사업자\" 등록</span>
            <span className="text-xs text-emerald-700 ml-auto">→ 의무 보증가입</span>
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div
              className={`rounded-xl p-5 text-center bg-${result.levelColor}-50 dark:bg-${result.levelColor}-950`}
              style={{
                backgroundColor:
                  result.level === "safe" ? "#ecfdf5" : result.level === "caution" ? "#fef3c7" : result.level === "danger" ? "#ffedd5" : "#ffe4e6",
              }}
            >
              <div className="text-sm mb-1" style={{ color: result.level === "safe" ? "#047857" : result.level === "caution" ? "#92400e" : result.level === "danger" ? "#9a3412" : "#9f1239" }}>
                위험도 종합 점수
              </div>
              <div
                className="text-5xl font-bold my-2"
                style={{ color: result.level === "safe" ? "#047857" : result.level === "caution" ? "#92400e" : result.level === "danger" ? "#9a3412" : "#9f1239" }}
              >
                {result.totalScore} <span className="text-2xl font-normal">/ 100</span>
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  backgroundColor:
                    result.level === "safe" ? "#10b981" : result.level === "caution" ? "#f59e0b" : result.level === "danger" ? "#f97316" : "#ef4444",
                  color: "white",
                }}
              >
                {result.levelLabel}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-sm">
              <strong>💬 진단:</strong> {result.advice}
            </div>

            {/* 세부 위험 지표 */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📊 세부 위험 지표</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div>
                    <div className="font-medium">① 전세가율</div>
                    <div className="text-xs text-slate-500">보증금 / 매매가 — 80%↑ 위험</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${result.jeonseRatio >= 80 ? "text-rose-600" : "text-emerald-600"}`}>
                      {result.jeonseRatio.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500">+{result.jeonseScore}점</div>
                  </div>
                </div>

                <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div>
                    <div className="font-medium">② 총 부담률 (깡통전세 지표)</div>
                    <div className="text-xs text-slate-500">(보증금+근저당) / 매매가 — 100%↑ 깡통</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${result.encumbranceRatio >= 80 ? "text-rose-600" : "text-emerald-600"}`}>
                      {result.encumbranceRatio.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500">+{result.encumbranceScore}점</div>
                  </div>
                </div>

                <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div>
                    <div className="font-medium">③ 건축 종류 위험</div>
                    <div className="text-xs text-slate-500">빌라·원룸이 가장 위험</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{BUILDING_LABEL[building]}</div>
                    <div className="text-xs text-slate-500">+{result.buildingScore}점</div>
                  </div>
                </div>

                <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div>
                    <div className="font-medium">④ 등기 소유자 일치</div>
                    <div className="text-xs text-slate-500">대리인·명의 차용 = 사기 위험</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${!landlordIsLandlord ? "text-rose-600" : "text-emerald-600"}`}>
                      {landlordIsLandlord ? "일치 ✓" : "불일치 ⚠️"}
                    </div>
                    <div className="text-xs text-slate-500">+{result.identityScore}점</div>
                  </div>
                </div>

                <div className="flex justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <div>
                    <div className="font-medium">⑤ 보호 장치</div>
                    <div className="text-xs text-slate-500">HUG·SGI / 임대사업자 등록</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">
                      {hugInsured && registeredBusiness ? "강력 보호" : hugInsured ? "보증 가입" : registeredBusiness ? "사업자 등록" : "보호 없음"}
                    </div>
                    <div className="text-xs text-emerald-700">{result.protectionScore}점</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">🛡️ 전세 사기 예방 5단계</h2>
        <ol className="list-decimal list-inside space-y-2 text-xs bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <li>
            <strong>등기부등본 직접 발급</strong> (인터넷등기소 1,000원) — \"갑구\" 소유자·\"을구\" 근저당 확인
          </li>
          <li>
            <strong>시세 교차 확인</strong> — 국토부 실거래가 (rt.molit.go.kr) + KB부동산 + 부동산 광고 3곳
          </li>
          <li>
            <strong>전세가율 80% 이하</strong> — 깡통전세 방지 (보증금 &lt; 매매가 × 80%)
          </li>
          <li>
            <strong>HUG·SGI 보증보험 가입</strong> — 보증금 100% 보호 (연 0.122~0.154%)
          </li>
          <li>
            <strong>확정일자 + 전입신고 즉시</strong> — 잔금일 당일 동주민센터 방문
          </li>
        </ol>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        ⚠️ <strong>참고용 진단</strong>: 본 도구는 일반 지표 기반 추정입니다. 실제 계약 전 변호사·공인중개사 상담 + HUG 안심전세 앱 (anjeonjeonse.kr) 확인 필수.
      </div>
    </CalculatorLayout>
  );
}
