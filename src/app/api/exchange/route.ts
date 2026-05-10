import { NextResponse } from "next/server";

export const revalidate = 3600;

type ExchangeResponse = { rates: Record<string, number>; date: string; source: string; base: string };

async function tryFrankfurter(base: string): Promise<ExchangeResponse | null> {
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.rates) return null;
    return { rates: data.rates, date: data.date, source: "ECB (Frankfurter)", base };
  } catch {
    return null;
  }
}

async function tryOpenER(base: string): Promise<ExchangeResponse | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result !== "success" || !data.rates) return null;
    return {
      rates: data.rates,
      date: data.time_last_update_utc?.slice(0, 16) || new Date().toISOString().slice(0, 10),
      source: "Open ER API",
      base,
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = (url.searchParams.get("base") || "USD").toUpperCase();
  const frank = await tryFrankfurter(base);
  if (frank) return NextResponse.json(frank);
  const open = await tryOpenER(base);
  if (open) return NextResponse.json(open);
  return NextResponse.json({ rates: {}, date: "fallback", source: "fallback", base }, { status: 500 });
}
