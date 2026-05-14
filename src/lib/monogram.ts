// 도구 shortTitle에서 2-4자 monogram 추출.
// - 영문/숫자 prefix가 있으면 그대로 (BMI, PDF, JSON, GPA, MBTI 등)
// - 한글이면 첫 글자 한 자
//
// 예시:
//  "BMI"          → "BMI"
//  "PDF 합치기"   → "PDF"
//  "JSON 포매터"  → "JSON" (4자 cap)
//  "만 나이"      → "만"
//  "양도세"       → "양"
//  "1RM"          → "1RM"
export function monogram(shortTitle: string): string {
  const trimmed = shortTitle.trim();
  const en = trimmed.match(/^[A-Za-z0-9]+/);
  if (en) {
    const t = en[0].toUpperCase();
    return t.length <= 4 ? t : t.slice(0, 3);
  }
  return trimmed.charAt(0);
}
