"use client";

import { useEffect, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  generateRentalContract,
  type RentalContractData,
} from "@/lib/koreanForms/rentalContract";
import { preloadKoreanFonts } from "@/lib/koreanForms/font";

const LS_KEY = "calai-pdf-form-myinfo";

type Role = "landlord" | "tenant";

type MyInfo = {
  name: string;
  idLast4: string;
  address: string;
  phone: string;
};

const EMPTY_INFO: MyInfo = { name: "", idLast4: "", address: "", phone: "" };

function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u.byteLength);
  new Uint8Array(ab).set(u);
  return ab;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatKoreanDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

// 숫자 콤마
function formatNumber(s: string) {
  const n = s.replace(/[^0-9]/g, "");
  if (!n) return "";
  return Number(n).toLocaleString("ko-KR");
}

export default function PdfFormPage() {
  const [myInfo, setMyInfo] = useState<MyInfo>(EMPTY_INFO);
  const [saveMyInfo, setSaveMyInfo] = useState(false);
  const [role, setRole] = useState<Role>("landlord");
  const [other, setOther] = useState<MyInfo>(EMPTY_INFO);

  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyArea, setPropertyArea] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");

  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [monthlyDueDay, setMonthlyDueDay] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [balance, setBalance] = useState("");
  const [balanceDate, setBalanceDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [specialTerms, setSpecialTerms] = useState("");
  const [contractDate, setContractDate] = useState(todayISO());

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // ─── localStorage 본인 정보 로드 ───
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MyInfo;
        setMyInfo({ ...EMPTY_INFO, ...parsed });
        setSaveMyInfo(true);
      }
    } catch {
      // ignore
    }
    // 폰트 사전 로드 (백그라운드)
    preloadKoreanFonts().catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setError("");
    // 검증
    if (!myInfo.name.trim()) {
      setError("본인 성명을 입력해 주세요.");
      return;
    }
    if (!other.name.trim()) {
      setError(`상대방(${role === "landlord" ? "임차인" : "임대인"}) 성명을 입력해 주세요.`);
      return;
    }
    if (!propertyAddress.trim()) {
      setError("임대 목적물 소재지를 입력해 주세요.");
      return;
    }
    if (!deposit.trim()) {
      setError("보증금을 입력해 주세요.");
      return;
    }
    if (!startDate || !endDate) {
      setError("임대차 기간(시작일·종료일)을 입력해 주세요.");
      return;
    }
    // localStorage 저장
    try {
      if (saveMyInfo) {
        localStorage.setItem(LS_KEY, JSON.stringify(myInfo));
      } else {
        localStorage.removeItem(LS_KEY);
      }
    } catch {
      // ignore
    }

    const landlord = role === "landlord" ? myInfo : other;
    const tenant = role === "landlord" ? other : myInfo;

    const data: RentalContractData = {
      landlordName: landlord.name,
      landlordIdLast4: landlord.idLast4,
      landlordAddress: landlord.address,
      landlordPhone: landlord.phone,
      tenantName: tenant.name,
      tenantIdLast4: tenant.idLast4,
      tenantAddress: tenant.address,
      tenantPhone: tenant.phone,
      propertyAddress,
      propertyArea,
      propertyDescription,
      deposit,
      monthlyRent,
      monthlyDueDay,
      downPayment,
      balance,
      balanceDate: formatKoreanDate(balanceDate),
      startDate: formatKoreanDate(startDate),
      endDate: formatKoreanDate(endDate),
      specialTerms,
      contractDate: formatKoreanDate(contractDate),
    };

    setProcessing(true);
    try {
      const bytes = await generateRentalContract(data);
      const blob = new Blob([toArrayBuffer(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `주택임대차계약서_${myInfo.name || "본인"}_${todayISO()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF 생성 실패:", e);
      setError(e instanceof Error ? `PDF 생성 실패: ${e.message}` : "PDF 생성 실패");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <CalculatorLayout
      title="한국 PDF 양식 자동 채우기 — 주택임대차계약서"
      description="주택임대차계약서를 본인 정보 입력만으로 한글 PDF 즉시 생성. 100% 브라우저 처리, 본인 정보는 localStorage에 저장(옵션) — 서버 전송 X."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        {/* 양식 선택 (현재 1종) */}
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 p-3 text-sm text-indigo-900 dark:text-indigo-300">
          📄 <strong>현재 양식</strong>: 주택임대차계약서 (1.0) · 추가 양식(근로계약서·동의서·차용증)은 다음 업데이트
        </div>

        {/* ── 1. 본인 정보 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            1. 본인 정보
          </h3>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldInput
                label="성명"
                value={myInfo.name}
                onChange={(v) => setMyInfo({ ...myInfo, name: v })}
                placeholder="홍길동"
                required
              />
              <FieldInput
                label="주민번호 뒤 4자리"
                value={myInfo.idLast4}
                onChange={(v) => setMyInfo({ ...myInfo, idLast4: v.replace(/[^0-9]/g, "").slice(0, 4) })}
                placeholder="1234"
                maxLength={4}
              />
            </div>
            <FieldInput
              label="주소"
              value={myInfo.address}
              onChange={(v) => setMyInfo({ ...myInfo, address: v })}
              placeholder="서울특별시 강남구 ..."
            />
            <FieldInput
              label="전화"
              value={myInfo.phone}
              onChange={(v) => setMyInfo({ ...myInfo, phone: v })}
              placeholder="010-1234-5678"
            />
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={saveMyInfo}
                onChange={(e) => setSaveMyInfo(e.target.checked)}
                className="accent-indigo-600"
              />
              본인 정보를 이 브라우저에 저장 (다음 방문 시 자동 입력. 100% 로컬, 서버 전송 X)
            </label>
          </div>
        </section>

        {/* ── 2. 본인 역할 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            2. 본인은 어느 쪽인가요?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "landlord" as Role, label: "🏠 임대인 (집주인)" },
                { id: "tenant" as Role, label: "🔑 임차인 (세입자)" },
              ]
            ).map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition ${
                  role === r.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── 3. 상대방 정보 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            3. {role === "landlord" ? "임차인 (세입자)" : "임대인 (집주인)"} 정보
          </h3>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldInput
                label="성명"
                value={other.name}
                onChange={(v) => setOther({ ...other, name: v })}
                required
              />
              <FieldInput
                label="주민번호 뒤 4자리"
                value={other.idLast4}
                onChange={(v) => setOther({ ...other, idLast4: v.replace(/[^0-9]/g, "").slice(0, 4) })}
                maxLength={4}
              />
            </div>
            <FieldInput label="주소" value={other.address} onChange={(v) => setOther({ ...other, address: v })} />
            <FieldInput label="전화" value={other.phone} onChange={(v) => setOther({ ...other, phone: v })} />
          </div>
        </section>

        {/* ── 4. 임대 목적물 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            4. 임대 목적물
          </h3>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <FieldInput
              label="소재지"
              value={propertyAddress}
              onChange={setPropertyAddress}
              placeholder="서울특별시 강남구 테헤란로 ... 101동 101호"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldInput label="면적" value={propertyArea} onChange={setPropertyArea} placeholder="59.85㎡" />
              <FieldInput
                label="구조·용도"
                value={propertyDescription}
                onChange={setPropertyDescription}
                placeholder="주거용 아파트"
              />
            </div>
          </div>
        </section>

        {/* ── 5. 계약 조건 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. 계약 조건
          </h3>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldInput
                label="보증금 (원)"
                value={deposit}
                onChange={(v) => setDeposit(formatNumber(v))}
                placeholder="100,000,000"
                required
              />
              <FieldInput
                label="월세 (원)"
                value={monthlyRent}
                onChange={(v) => setMonthlyRent(formatNumber(v))}
                placeholder="500,000 (전세면 비움)"
              />
            </div>
            {monthlyRent && monthlyRent !== "0" && (
              <FieldInput
                label="월세 지급일 (매월)"
                value={monthlyDueDay}
                onChange={(v) => setMonthlyDueDay(v.replace(/[^0-9]/g, "").slice(0, 2))}
                placeholder="25"
                maxLength={2}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldInput
                label="계약금 (원)"
                value={downPayment}
                onChange={(v) => setDownPayment(formatNumber(v))}
                placeholder="10,000,000"
              />
              <FieldInput
                label="잔금 (원)"
                value={balance}
                onChange={(v) => setBalance(formatNumber(v))}
                placeholder="90,000,000"
              />
            </div>
            <FieldDate label="잔금 지급일" value={balanceDate} onChange={setBalanceDate} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldDate label="임대차 시작일" value={startDate} onChange={setStartDate} required />
              <FieldDate label="임대차 종료일" value={endDate} onChange={setEndDate} required />
            </div>
          </div>
        </section>

        {/* ── 6. 특약사항 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            6. 특약사항 (선택)
          </h3>
          <textarea
            value={specialTerms}
            onChange={(e) => setSpecialTerms(e.target.value)}
            rows={5}
            placeholder="예) 반려동물 사육 금지. 흡연 금지. 임차인은 입주 시 도배·청소 비용을 부담한다. ..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </section>

        {/* ── 7. 계약일 + 생성 ── */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            7. 계약일
          </h3>
          <FieldDate label="계약 체결일" value={contractDate} onChange={setContractDate} />
        </section>

        {error && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={processing}
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {processing ? "PDF 생성 중..." : "📄 PDF 다운로드"}
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        ⚠️ <strong>본 문서의 효력</strong>: 본 PDF는 계약 초안 작성을 돕는 참고용 양식입니다. 실제 계약의 법적 효력은
        당사자 서명·날인으로 발생합니다. 고액·특수 계약은 공인중개사·변호사 상담을 권장합니다. 본 양식은 국토교통부 표준
        주택임대차계약서를 참고하여 재구성한 일반 양식이며 정부 공식 양식과 다를 수 있습니다.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 입력 정보가 서버로 전송되지 않습니다. 모든 PDF 생성은 브라우저 안에서. 본인 정보
        저장 옵션은 이 브라우저의 localStorage에만 저장됩니다.
      </div>
      <div className="mt-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-700 dark:text-slate-300">
        🔤 <strong>한글 폰트</strong>: NanumGothic (네이버, SIL OFL 1.1 라이선스).
      </div>
    </CalculatorLayout>
  );
}

// ─────────────────────────────────────────────────────────────
// 작은 컴포넌트
// ─────────────────────────────────────────────────────────────
function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
      />
    </label>
  );
}

function FieldDate({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
      />
    </label>
  );
}
