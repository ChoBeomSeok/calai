import { NextResponse } from "next/server";

export const revalidate = 3600; // 1시간 캐시

const FALLBACK_RATES: Record<string, number> = {
  USD: 1380, EUR: 1490, JPY: 9.2, CNY: 190, GBP: 1750,
  AUD: 910, CAD: 1010, CHF: 1560, HKD: 177, SGD: 1030,
};

type ExchangeResponse = { rate: number; date: string; source: string };

async function tryFrankfurter(from: string): Promise<ExchangeResponse | null> {
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=KRW`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.rates?.KRW) return null;
    return { rate: data.rates.KRW, date: data.date, source: "ECB (Frankfurter)" };
  } catch {
    return null;
  }
}

async function tryOpenER(from: string): Promise<ExchangeResponse | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result !== "success" || !data.rates?.KRW) return null;
    return {
      rate: data.rates.KRW,
      date: data.time_last_update_utc?.slice(0, 16) || new Date().toISOString().slice(0, 10),
      source: "Open ER API",
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = (url.searchParams.get("from") || "USD").toUpperCase();

  // 1차 시도 — Frankfurter (ECB)
  const frank = await tryFrankfurter(from);
  if (frank) return NextResponse.json(frank);

  // 2차 시도 — Open Exchange Rate API
  const open = await tryOpenER(from);
  if (open) return NextResponse.json(open);

  // 모두 실패 시 fallback 환율
  return NextResponse.json({
    rate: FALLBACK_RATES[from] || 1,
    date: "fallback",
    source: "fallback (offline)",
  });
}
