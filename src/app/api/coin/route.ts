import { NextResponse } from "next/server";

export const revalidate = 60; // 1분 캐시

const POPULAR_COINS = [
  "KRW-BTC", "KRW-ETH", "KRW-XRP", "KRW-SOL", "KRW-DOGE",
  "KRW-ADA", "KRW-TRX", "KRW-AVAX", "KRW-MATIC", "KRW-DOT",
];

type CoinTicker = {
  market: string;
  trade_price: number;
  signed_change_rate: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const market = url.searchParams.get("market"); // 단일 코인 조회
  const targets = market ? [market.toUpperCase()] : POPULAR_COINS;

  try {
    const res = await fetch(
      `https://api.upbit.com/v1/ticker?markets=${targets.join(",")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Upbit API ${res.status}`);
    const data: CoinTicker[] = await res.json();
    const result = data.map((c) => ({
      market: c.market,
      symbol: c.market.replace("KRW-", ""),
      price: c.trade_price,
      changeRate: c.signed_change_rate,
    }));
    return NextResponse.json({ data: result, updatedAt: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message, data: [] },
      { status: 500 }
    );
  }
}
