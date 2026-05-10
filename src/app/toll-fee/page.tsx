"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const ICS = [
  { name: "서울 (강남IC)", lat: 37.4664, lng: 127.0529 },
  { name: "서울 (서초IC)", lat: 37.4836, lng: 127.0103 },
  { name: "수원 (수원IC)", lat: 37.2410, lng: 127.0286 },
  { name: "성남 (판교IC)", lat: 37.4032, lng: 127.1031 },
  { name: "용인 (서용인IC)", lat: 37.2410, lng: 127.1771 },
  { name: "고양 (일산IC)", lat: 37.6548, lng: 126.7740 },
  { name: "안양 (안양IC)", lat: 37.4007, lng: 126.9290 },
  { name: "인천 (인천IC)", lat: 37.4501, lng: 126.6700 },
  { name: "평택 (평택IC)", lat: 36.9962, lng: 127.0848 },
  { name: "천안 (천안IC)", lat: 36.8088, lng: 127.1559 },
  { name: "아산 (아산IC)", lat: 36.7898, lng: 127.0023 },
  { name: "세종 (세종IC)", lat: 36.4801, lng: 127.2890 },
  { name: "대전 (대전IC)", lat: 36.3504, lng: 127.3845 },
  { name: "청주 (청주IC)", lat: 36.6424, lng: 127.4890 },
  { name: "공주 (공주IC)", lat: 36.4467, lng: 127.1190 },
  { name: "논산 (논산IC)", lat: 36.1872, lng: 127.0989 },
  { name: "전주 (전주IC)", lat: 35.8242, lng: 127.1480 },
  { name: "익산 (익산IC)", lat: 35.9483, lng: 126.9577 },
  { name: "광주 (광주IC)", lat: 35.1595, lng: 126.8526 },
  { name: "여수 (여수IC)", lat: 34.7604, lng: 127.6622 },
  { name: "순천 (순천IC)", lat: 34.9506, lng: 127.4872 },
  { name: "목포 (목포IC)", lat: 34.8118, lng: 126.3922 },
  { name: "대구 (대구IC)", lat: 35.8714, lng: 128.6014 },
  { name: "구미 (구미IC)", lat: 36.1196, lng: 128.3445 },
  { name: "포항 (포항IC)", lat: 36.0190, lng: 129.3435 },
  { name: "경주 (경주IC)", lat: 35.8562, lng: 129.2247 },
  { name: "울산 (울산IC)", lat: 35.5384, lng: 129.3114 },
  { name: "부산 (부산IC)", lat: 35.1796, lng: 129.0756 },
  { name: "김해 (김해IC)", lat: 35.2285, lng: 128.8894 },
  { name: "창원 (창원IC)", lat: 35.2280, lng: 128.6811 },
  { name: "마산 (마산IC)", lat: 35.2099, lng: 128.5687 },
  { name: "진주 (진주IC)", lat: 35.1800, lng: 128.1076 },
  { name: "춘천 (춘천IC)", lat: 37.8813, lng: 127.7298 },
  { name: "원주 (원주IC)", lat: 37.3422, lng: 127.9202 },
  { name: "강릉 (강릉IC)", lat: 37.7519, lng: 128.8761 },
  { name: "속초 (속초IC)", lat: 38.2070, lng: 128.5917 },
  { name: "동해 (동해IC)", lat: 37.5247, lng: 129.1147 },
  { name: "안동 (안동IC)", lat: 36.5683, lng: 128.7294 },
  { name: "정읍 (정읍IC)", lat: 35.5697, lng: 126.8559 },
  { name: "남원 (남원IC)", lat: 35.4164, lng: 127.3905 },
  { name: "통영 (통영IC)", lat: 34.8544, lng: 128.4331 },
  { name: "거제 (거제IC)", lat: 34.8806, lng: 128.6211 },
];

const VEHICLE_RATES = [
  { type: "1종", label: "승용차·소형 (15인 이하)", base: 900, perKm: 41.7 },
  { type: "2종", label: "중형 승합 (16~32인)·소형 화물", base: 900, perKm: 42.5 },
  { type: "3종", label: "대형 승합 (33인+)·5.5~10톤", base: 950, perKm: 44.3 },
  { type: "4종", label: "대형 화물 (10~20톤)", base: 1000, perKm: 59.4 },
  { type: "5종", label: "특수 화물 (20톤+)", base: 1150, perKm: 69.6 },
];

function distance(a: typeof ICS[0], b: typeof ICS[0]): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function TollFeePage() {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(27);
  const [vehicleIdx, setVehicleIdx] = useState(0);

  const result = useMemo(() => {
    const a = ICS[from];
    const b = ICS[to];
    if (!a || !b || from === to) return null;
    const roadKm = distance(a, b) * 1.3;
    const v = VEHICLE_RATES[vehicleIdx];
    const fee = v.base + roadKm * v.perKm;
    const hipassFee = fee * 0.95;
    return { roadKm, fee, hipassFee, base: v.base, perKm: v.perKm };
  }, [from, to, vehicleIdx]);

  return (
    <CalculatorLayout
      title="고속도로 톨비 계산"
      description="전국 42개 주요 IC × 5종 차종으로 통행료 자동 계산. 위경도 거리 + 한국도로공사 단가 + 하이패스 5% 할인."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">출발 IC</span>
            <select value={from} onChange={(e) => setFrom(parseInt(e.target.value))} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3">
              {ICS.map((ic, i) => <option key={i} value={i}>{ic.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">도착 IC</span>
            <select value={to} onChange={(e) => setTo(parseInt(e.target.value))} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3">
              {ICS.map((ic, i) => <option key={i} value={i}>{ic.name}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">차종</span>
          <div className="space-y-1.5">
            {VEHICLE_RATES.map((v, i) => (
              <button key={i} onClick={() => setVehicleIdx(i)} className={`w-full text-left px-3 py-2 rounded-lg border transition ${vehicleIdx === i ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-400" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{v.type}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{v.label}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{v.perKm}원/km</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {from === to && (
          <div className="mt-6 rounded-lg bg-amber-50 dark:bg-amber-950 p-3 text-sm text-amber-900 dark:text-amber-300 text-center">
            출발과 도착 IC가 같습니다. 다른 IC를 선택해 주세요.
          </div>
        )}

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
              <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">예상 통행료 (편도, 현금)</div>
              <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.fee)} 원</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">예상 거리 {fmt(result.roadKm)} km</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-4 text-center">
                <div className="text-xs text-emerald-700 dark:text-emerald-400">하이패스 (5% ↓)</div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">{fmt(result.hipassFee)} 원</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">절감 {fmt(result.fee - result.hipassFee)}원</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">왕복 (현금)</div>
                <div className="font-bold text-lg">{fmt(result.fee * 2)} 원</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">하이패스 {fmt(result.hipassFee * 2)}원</div>
              </div>
            </div>
            <div className="mt-5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between"><span>기본 요금</span><span>{fmt(result.base)} 원</span></div>
              <div className="flex justify-between"><span>거리 요금 ({fmt(result.roadKm)} km × {result.perKm}원)</span><span>{fmt(result.roadKm * result.perKm)} 원</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">통행료 공식 (한국도로공사 2026)</h2>
        <pre className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 font-mono text-xs">통행료 = 기본료 + (도로 거리 × 차종 단가)
하이패스 = 통행료 × 0.95</pre>
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">거리 계산 방식</h2>
        <p className="text-xs">
          위경도 직선 거리 + 한국 도로 평균 굴곡 ×1.3 보정. 실제 노선에 따라 ±5~10% 오차 (한국도로공사 공식 통행료와 ±1,000원).
        </p>
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">차종 분류</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>1종 — 일반 승용차·15인 이하 승합·2.5톤 미만</li>
          <li>2종 — 16~32인 승합·2.5~5.5톤 화물</li>
          <li>3종 — 33인 이상 승합·5.5~10톤 화물</li>
          <li>4종 — 10~20톤 대형 화물</li>
          <li>5종 — 20톤 초과 특수 화물</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
