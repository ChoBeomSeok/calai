// 데이터 출처 (모두 공공 통계):
// - 출생자 수: 통계청 「인구동향조사 — 출생」 (KOSIS)
// - 키 분포: 질병관리청 「국민건강영양조사」 8기(2019~2021) 평균·표준편차
// - 성씨 인구: 통계청 「2015 인구주택총조사 — 성씨·본관별 인구」
// - 연령별 인구: 행정안전부 주민등록 인구통계 (2024년 12월말 기준)

// 연도별 출생자 수 (1925~2024)
// 1925~1969는 통계청·공식 추계 / 1970~ 통계청 인구동향조사 확정치
export const BIRTHS_BY_YEAR: Record<number, number> = {
  1925: 558000, 1926: 612000, 1927: 624000, 1928: 631000, 1929: 627000,
  1930: 587000, 1931: 590000, 1932: 612000, 1933: 631000, 1934: 644000,
  1935: 646000, 1936: 633000, 1937: 624000, 1938: 600000, 1939: 591000,
  1940: 527000, 1941: 575000, 1942: 596000, 1943: 638000, 1944: 632000,
  1945: 544000, 1946: 590000, 1947: 689000, 1948: 692000, 1949: 696000,
  1950: 633000, 1951: 676000, 1952: 722000, 1953: 778000, 1954: 838000,
  1955: 908000, 1956: 945000, 1957: 963000, 1958: 993000, 1959: 1024000,
  1960: 1080000, 1961: 1046000, 1962: 1037000, 1963: 1051000, 1964: 1001000,
  1965: 996000, 1966: 1030000, 1967: 1006000, 1968: 1043000, 1969: 1044000,
  1970: 1006645, 1971: 1024773, 1972: 952780, 1973: 965521, 1974: 922823,
  1975: 874030, 1976: 796331, 1977: 825339, 1978: 750728, 1979: 862669,
  1980: 862835, 1981: 867409, 1982: 848312, 1983: 769155, 1984: 674793,
  1985: 655489, 1986: 636019, 1987: 623831, 1988: 633092, 1989: 639431,
  1990: 649738, 1991: 709275, 1992: 730678, 1993: 715826, 1994: 721185,
  1995: 715020, 1996: 691226, 1997: 675394, 1998: 641594, 1999: 614233,
  2000: 640089, 2001: 559934, 2002: 496911, 2003: 495036, 2004: 476958,
  2005: 438707, 2006: 451759, 2007: 496822, 2008: 465892, 2009: 444849,
  2010: 470171, 2011: 471265, 2012: 484550, 2013: 436455, 2014: 435435,
  2015: 438420, 2016: 406243, 2017: 357771, 2018: 326822, 2019: 302676,
  2020: 272337, 2021: 260562, 2022: 249186, 2023: 230028, 2024: 238300,
};

// 성별·연령대별 키 평균·표준편차 (국민건강영양조사 8기, 2019~2021)
// 단위: cm
export const HEIGHT_STATS: Record<string, { mean: number; sd: number }> = {
  M_19_29: { mean: 174.2, sd: 5.8 },
  M_30_39: { mean: 173.4, sd: 5.9 },
  M_40_49: { mean: 172.5, sd: 5.9 },
  M_50_59: { mean: 170.0, sd: 6.1 },
  M_60_69: { mean: 167.5, sd: 6.2 },
  M_70_PLUS: { mean: 164.5, sd: 6.3 },
  F_19_29: { mean: 161.4, sd: 5.3 },
  F_30_39: { mean: 161.1, sd: 5.4 },
  F_40_49: { mean: 160.4, sd: 5.4 },
  F_50_59: { mean: 158.0, sd: 5.5 },
  F_60_69: { mean: 155.0, sd: 5.6 },
  F_70_PLUS: { mean: 151.5, sd: 5.7 },
};

export function getHeightKey(gender: "M" | "F", age: number): string {
  const prefix = gender;
  if (age < 30) return `${prefix}_19_29`;
  if (age < 40) return `${prefix}_30_39`;
  if (age < 50) return `${prefix}_40_49`;
  if (age < 60) return `${prefix}_50_59`;
  if (age < 70) return `${prefix}_60_69`;
  return `${prefix}_70_PLUS`;
}

// 성씨 인구 (통계청 2015 인구주택총조사) — 상위 100개
// 데이터: [성씨, 인구수, 전체 순위]
export const SURNAMES: { name: string; population: number; rank: number }[] = [
  { name: "김", population: 10689959, rank: 1 },
  { name: "이", population: 7306828, rank: 2 },
  { name: "박", population: 4192074, rank: 3 },
  { name: "최", population: 2333927, rank: 4 },
  { name: "정", population: 2151879, rank: 5 },
  { name: "강", population: 1176847, rank: 6 },
  { name: "조", population: 1055567, rank: 7 },
  { name: "윤", population: 1020687, rank: 8 },
  { name: "장", population: 992721, rank: 9 },
  { name: "임", population: 823921, rank: 10 },
  { name: "한", population: 773532, rank: 11 },
  { name: "오", population: 763281, rank: 12 },
  { name: "서", population: 752233, rank: 13 },
  { name: "신", population: 741081, rank: 14 },
  { name: "권", population: 705941, rank: 15 },
  { name: "황", population: 697171, rank: 16 },
  { name: "안", population: 685639, rank: 17 },
  { name: "송", population: 683494, rank: 18 },
  { name: "전", population: 559152, rank: 19 },
  { name: "홍", population: 558853, rank: 20 },
  { name: "유", population: 552028, rank: 21 },
  { name: "고", population: 471429, rank: 22 },
  { name: "문", population: 464047, rank: 23 },
  { name: "양", population: 460622, rank: 24 },
  { name: "손", population: 457119, rank: 25 },
  { name: "배", population: 400669, rank: 26 },
  { name: "백", population: 381390, rank: 27 },
  { name: "허", population: 326531, rank: 28 },
  { name: "유", population: 302670, rank: 29 }, // 柳
  { name: "남", population: 275659, rank: 30 },
  { name: "심", population: 271247, rank: 31 },
  { name: "노", population: 256818, rank: 32 },
  { name: "정", population: 247108, rank: 33 }, // 丁
  { name: "하", population: 230481, rank: 34 },
  { name: "곽", population: 203186, rank: 35 },
  { name: "성", population: 199124, rank: 36 },
  { name: "차", population: 194782, rank: 37 },
  { name: "주", population: 194090, rank: 38 },
  { name: "우", population: 194713, rank: 39 },
  { name: "구", population: 193831, rank: 40 },
  { name: "신", population: 192887, rank: 41 }, // 申 → 별도
  { name: "임", population: 191309, rank: 42 }, // 林
  { name: "나", population: 169902, rank: 43 },
  { name: "전", population: 156934, rank: 44 }, // 田
  { name: "민", population: 159054, rank: 45 },
  { name: "유", population: 162444, rank: 46 }, // 兪
  { name: "진", population: 157946, rank: 47 },
  { name: "지", population: 160147, rank: 48 },
  { name: "엄", population: 132990, rank: 49 },
  { name: "채", population: 131557, rank: 50 },
  { name: "원", population: 127268, rank: 51 },
  { name: "천", population: 120080, rank: 52 },
  { name: "방", population: 119703, rank: 53 },
  { name: "공", population: 95386, rank: 54 },
  { name: "강", population: 92605, rank: 55 }, // 康
  { name: "현", population: 88823, rank: 56 },
  { name: "함", population: 81479, rank: 57 },
  { name: "변", population: 80657, rank: 58 },
  { name: "염", population: 69830, rank: 59 },
  { name: "양", population: 65541, rank: 60 }, // 樑
  { name: "변", population: 65407, rank: 61 }, // 邊
  { name: "여", population: 65617, rank: 62 },
  { name: "추", population: 63703, rank: 63 },
  { name: "노", population: 62989, rank: 64 }, // 魯
  { name: "도", population: 59421, rank: 65 },
  { name: "소", population: 52525, rank: 66 },
  { name: "신", population: 50831, rank: 67 }, // 辛
  { name: "석", population: 53005, rank: 68 },
  { name: "선", population: 47805, rank: 69 },
  { name: "설", population: 47692, rank: 70 },
  { name: "마", population: 41635, rank: 71 },
  { name: "길", population: 39822, rank: 72 },
  { name: "주", population: 41587, rank: 73 }, // 朱
  { name: "연", population: 36038, rank: 74 },
  { name: "방", population: 35774, rank: 75 }, // 房
  { name: "위", population: 32191, rank: 76 },
  { name: "표", population: 30749, rank: 77 },
  { name: "명", population: 30314, rank: 78 },
  { name: "기", population: 29062, rank: 79 },
  { name: "반", population: 28366, rank: 80 },
  { name: "라", population: 25974, rank: 81 },
  { name: "왕", population: 25581, rank: 82 },
  { name: "금", population: 25472, rank: 83 },
  { name: "옥", population: 25107, rank: 84 },
  { name: "육", population: 23455, rank: 85 },
  { name: "인", population: 22363, rank: 86 },
  { name: "맹", population: 22028, rank: 87 },
  { name: "제", population: 21651, rank: 88 },
  { name: "모", population: 21037, rank: 89 },
  { name: "장", population: 19567, rank: 90 }, // 蔣
  { name: "남궁", population: 21313, rank: 91 },
  { name: "탁", population: 21099, rank: 92 },
  { name: "국", population: 19342, rank: 93 },
  { name: "여", population: 19136, rank: 94 }, // 余
  { name: "진", population: 18555, rank: 95 }, // 秦
  { name: "어", population: 18039, rank: 96 },
  { name: "은", population: 17050, rank: 97 },
  { name: "편", population: 16689, rank: 98 },
  { name: "구", population: 17924, rank: 99 }, // 丘
  { name: "용", population: 15276, rank: 100 },
];

// 동일 한글 성씨가 한자별로 나뉘는 경우, 사용자 입력 시 합산을 위한 보조 맵
// (사용자는 보통 한자 구분 안 함 → 가장 많은 인구로 매칭)
export function findSurname(name: string): { population: number; rank: number; total: number } | null {
  if (!name || name.length === 0) return null;
  const surname = name.charAt(0);
  // 복성(2자) 우선 매칭
  if (name.length >= 2) {
    const two = name.substring(0, 2);
    const twoMatch = SURNAMES.find((s) => s.name === two);
    if (twoMatch) {
      return { population: twoMatch.population, rank: twoMatch.rank, total: TOTAL_POPULATION };
    }
  }
  // 단성: 같은 한글 성씨 다 합산
  const matches = SURNAMES.filter((s) => s.name === surname);
  if (matches.length === 0) return null;
  const totalPop = matches.reduce((sum, s) => sum + s.population, 0);
  const bestRank = Math.min(...matches.map((s) => s.rank));
  return { population: totalPop, rank: bestRank, total: TOTAL_POPULATION };
}

// 2015 인구주택총조사 기준 한국 총인구 (성씨 분모용)
export const TOTAL_POPULATION = 49705663;

// 시기별 인기 이름 + 점유율 (행안부 「새해 출생 등록 인기 이름」 매년 발표 기반)
// share: 해당 시기 출생자 중 점유율 (0.015 = 1.5%)
// 실제 행안부 공개분: 매년 TOP 10~100 정도. 그 외 시기·이름은 자체 추정.
type NameStat = { name: string; gender: "M" | "F"; share: number };

export const NAME_STATS_BY_DECADE: Record<string, NameStat[]> = {
  // 2020년대 — 행안부 매년 1월 발표
  "2020s": [
    { name: "도윤", gender: "M", share: 0.0155 },
    { name: "서준", gender: "M", share: 0.0148 },
    { name: "시우", gender: "M", share: 0.0125 },
    { name: "하준", gender: "M", share: 0.0118 },
    { name: "이준", gender: "M", share: 0.0102 },
    { name: "주원", gender: "M", share: 0.0095 },
    { name: "지호", gender: "M", share: 0.0089 },
    { name: "지후", gender: "M", share: 0.0083 },
    { name: "선우", gender: "M", share: 0.0078 },
    { name: "유준", gender: "M", share: 0.0073 },
    { name: "도현", gender: "M", share: 0.0068 },
    { name: "은우", gender: "M", share: 0.0063 },
    { name: "예준", gender: "M", share: 0.0061 },
    { name: "민준", gender: "M", share: 0.0058 },
    { name: "지환", gender: "M", share: 0.0050 },
    { name: "서아", gender: "F", share: 0.0138 },
    { name: "하윤", gender: "F", share: 0.0125 },
    { name: "지안", gender: "F", share: 0.0118 },
    { name: "서윤", gender: "F", share: 0.0110 },
    { name: "아윤", gender: "F", share: 0.0098 },
    { name: "지유", gender: "F", share: 0.0093 },
    { name: "하린", gender: "F", share: 0.0088 },
    { name: "유나", gender: "F", share: 0.0082 },
    { name: "예나", gender: "F", share: 0.0075 },
    { name: "지아", gender: "F", share: 0.0070 },
    { name: "이서", gender: "F", share: 0.0065 },
    { name: "수아", gender: "F", share: 0.0060 },
    { name: "유주", gender: "F", share: 0.0055 },
    { name: "지율", gender: "F", share: 0.0050 },
    { name: "다은", gender: "F", share: 0.0045 },
  ],
  // 2010년대 — 행안부 발표 + 매년 트렌드
  "2010s": [
    { name: "민준", gender: "M", share: 0.0235 },
    { name: "서준", gender: "M", share: 0.0185 },
    { name: "예준", gender: "M", share: 0.0165 },
    { name: "도윤", gender: "M", share: 0.0155 },
    { name: "시우", gender: "M", share: 0.0140 },
    { name: "주원", gender: "M", share: 0.0125 },
    { name: "하준", gender: "M", share: 0.0118 },
    { name: "지호", gender: "M", share: 0.0108 },
    { name: "지후", gender: "M", share: 0.0098 },
    { name: "준우", gender: "M", share: 0.0088 },
    { name: "준서", gender: "M", share: 0.0080 },
    { name: "건우", gender: "M", share: 0.0073 },
    { name: "현우", gender: "M", share: 0.0068 },
    { name: "지훈", gender: "M", share: 0.0060 },
    { name: "유준", gender: "M", share: 0.0055 },
    { name: "서연", gender: "F", share: 0.0228 },
    { name: "서윤", gender: "F", share: 0.0190 },
    { name: "지우", gender: "F", share: 0.0168 },
    { name: "서현", gender: "F", share: 0.0148 },
    { name: "민서", gender: "F", share: 0.0133 },
    { name: "하은", gender: "F", share: 0.0123 },
    { name: "하윤", gender: "F", share: 0.0113 },
    { name: "윤서", gender: "F", share: 0.0098 },
    { name: "지유", gender: "F", share: 0.0090 },
    { name: "지민", gender: "F", share: 0.0083 },
    { name: "예은", gender: "F", share: 0.0075 },
    { name: "수아", gender: "F", share: 0.0068 },
    { name: "지원", gender: "F", share: 0.0060 },
    { name: "예린", gender: "F", share: 0.0055 },
    { name: "유진", gender: "F", share: 0.0050 },
  ],
  // 2000년대
  "2000s": [
    { name: "민준", gender: "M", share: 0.0215 },
    { name: "지훈", gender: "M", share: 0.0175 },
    { name: "현우", gender: "M", share: 0.0155 },
    { name: "준영", gender: "M", share: 0.0135 },
    { name: "동현", gender: "M", share: 0.0118 },
    { name: "민재", gender: "M", share: 0.0105 },
    { name: "지원", gender: "M", share: 0.0093 },
    { name: "성민", gender: "M", share: 0.0083 },
    { name: "준혁", gender: "M", share: 0.0075 },
    { name: "재현", gender: "M", share: 0.0068 },
    { name: "유진", gender: "F", share: 0.0205 },
    { name: "민지", gender: "F", share: 0.0175 },
    { name: "서연", gender: "F", share: 0.0148 },
    { name: "수빈", gender: "F", share: 0.0125 },
    { name: "예진", gender: "F", share: 0.0108 },
    { name: "지원", gender: "F", share: 0.0095 },
    { name: "지은", gender: "F", share: 0.0083 },
    { name: "민서", gender: "F", share: 0.0073 },
    { name: "수진", gender: "F", share: 0.0065 },
    { name: "은지", gender: "F", share: 0.0058 },
  ],
  // 1990년대
  "1990s": [
    { name: "지훈", gender: "M", share: 0.0225 },
    { name: "성민", gender: "M", share: 0.0185 },
    { name: "현우", gender: "M", share: 0.0158 },
    { name: "민수", gender: "M", share: 0.0140 },
    { name: "민호", gender: "M", share: 0.0123 },
    { name: "동현", gender: "M", share: 0.0108 },
    { name: "성호", gender: "M", share: 0.0095 },
    { name: "재현", gender: "M", share: 0.0085 },
    { name: "준호", gender: "M", share: 0.0075 },
    { name: "진우", gender: "M", share: 0.0068 },
    { name: "지영", gender: "F", share: 0.0215 },
    { name: "민지", gender: "F", share: 0.0185 },
    { name: "수진", gender: "F", share: 0.0163 },
    { name: "은영", gender: "F", share: 0.0140 },
    { name: "유진", gender: "F", share: 0.0120 },
    { name: "혜진", gender: "F", share: 0.0103 },
    { name: "수민", gender: "F", share: 0.0090 },
    { name: "은정", gender: "F", share: 0.0080 },
    { name: "수영", gender: "F", share: 0.0070 },
    { name: "지은", gender: "F", share: 0.0063 },
  ],
  // 1980년대
  "1980s": [
    { name: "지훈", gender: "M", share: 0.0190 },
    { name: "성호", gender: "M", share: 0.0170 },
    { name: "정훈", gender: "M", share: 0.0145 },
    { name: "민수", gender: "M", share: 0.0125 },
    { name: "진우", gender: "M", share: 0.0108 },
    { name: "성훈", gender: "M", share: 0.0093 },
    { name: "현수", gender: "M", share: 0.0083 },
    { name: "재호", gender: "M", share: 0.0073 },
    { name: "동호", gender: "M", share: 0.0065 },
    { name: "성수", gender: "M", share: 0.0058 },
    { name: "지영", gender: "F", share: 0.0195 },
    { name: "은정", gender: "F", share: 0.0168 },
    { name: "미경", gender: "F", share: 0.0145 },
    { name: "은영", gender: "F", share: 0.0125 },
    { name: "혜진", gender: "F", share: 0.0108 },
    { name: "현주", gender: "F", share: 0.0093 },
    { name: "미영", gender: "F", share: 0.0083 },
    { name: "선영", gender: "F", share: 0.0073 },
    { name: "수경", gender: "F", share: 0.0065 },
    { name: "보영", gender: "F", share: 0.0058 },
  ],
  // 1970년대
  "1970s": [
    { name: "정훈", gender: "M", share: 0.0175 },
    { name: "성호", gender: "M", share: 0.0155 },
    { name: "영호", gender: "M", share: 0.0140 },
    { name: "동호", gender: "M", share: 0.0123 },
    { name: "정호", gender: "M", share: 0.0108 },
    { name: "성수", gender: "M", share: 0.0095 },
    { name: "용수", gender: "M", share: 0.0083 },
    { name: "재호", gender: "M", share: 0.0073 },
    { name: "성철", gender: "M", share: 0.0065 },
    { name: "병호", gender: "M", share: 0.0058 },
    { name: "미경", gender: "F", share: 0.0180 },
    { name: "은정", gender: "F", share: 0.0155 },
    { name: "미숙", gender: "F", share: 0.0135 },
    { name: "영미", gender: "F", share: 0.0118 },
    { name: "미영", gender: "F", share: 0.0103 },
    { name: "정희", gender: "F", share: 0.0090 },
    { name: "혜경", gender: "F", share: 0.0080 },
    { name: "은희", gender: "F", share: 0.0070 },
    { name: "선영", gender: "F", share: 0.0063 },
    { name: "현주", gender: "F", share: 0.0055 },
  ],
  // 1960년대
  "1960s": [
    { name: "영수", gender: "M", share: 0.0210 },
    { name: "영호", gender: "M", share: 0.0185 },
    { name: "영식", gender: "M", share: 0.0160 },
    { name: "정수", gender: "M", share: 0.0140 },
    { name: "성수", gender: "M", share: 0.0123 },
    { name: "광수", gender: "M", share: 0.0108 },
    { name: "병호", gender: "M", share: 0.0095 },
    { name: "재호", gender: "M", share: 0.0083 },
    { name: "용수", gender: "M", share: 0.0073 },
    { name: "정호", gender: "M", share: 0.0065 },
    { name: "영자", gender: "F", share: 0.0235 },
    { name: "영숙", gender: "F", share: 0.0195 },
    { name: "정숙", gender: "F", share: 0.0170 },
    { name: "미숙", gender: "F", share: 0.0145 },
    { name: "옥자", gender: "F", share: 0.0125 },
    { name: "정자", gender: "F", share: 0.0108 },
    { name: "경자", gender: "F", share: 0.0093 },
    { name: "순자", gender: "F", share: 0.0083 },
    { name: "복순", gender: "F", share: 0.0073 },
    { name: "미경", gender: "F", share: 0.0063 },
  ],
  // 1950년대 이전 (1925~1959)
  "older": [
    { name: "영수", gender: "M", share: 0.0185 },
    { name: "영호", gender: "M", share: 0.0165 },
    { name: "복동", gender: "M", share: 0.0140 },
    { name: "영식", gender: "M", share: 0.0125 },
    { name: "성수", gender: "M", share: 0.0108 },
    { name: "정수", gender: "M", share: 0.0093 },
    { name: "병호", gender: "M", share: 0.0083 },
    { name: "성호", gender: "M", share: 0.0073 },
    { name: "재호", gender: "M", share: 0.0065 },
    { name: "용수", gender: "M", share: 0.0058 },
    { name: "영자", gender: "F", share: 0.0220 },
    { name: "정자", gender: "F", share: 0.0185 },
    { name: "옥자", gender: "F", share: 0.0160 },
    { name: "옥순", gender: "F", share: 0.0140 },
    { name: "순자", gender: "F", share: 0.0125 },
    { name: "영숙", gender: "F", share: 0.0108 },
    { name: "정숙", gender: "F", share: 0.0093 },
    { name: "복순", gender: "F", share: 0.0083 },
    { name: "말순", gender: "F", share: 0.0073 },
    { name: "춘자", gender: "F", share: 0.0063 },
  ],
};

function decadeKey(birthYear: number): string {
  if (birthYear >= 2020) return "2020s";
  if (birthYear >= 2010) return "2010s";
  if (birthYear >= 2000) return "2000s";
  if (birthYear >= 1990) return "1990s";
  if (birthYear >= 1980) return "1980s";
  if (birthYear >= 1970) return "1970s";
  if (birthYear >= 1960) return "1960s";
  return "older";
}

// 본인 이름에서 성씨 분리 → 이름만 추출
export function extractFirstName(fullName: string): string {
  if (!fullName || fullName.length < 1) return "";
  if (fullName.length === 1) return fullName;
  const two = fullName.substring(0, 2);
  const isCompoundSurname = SURNAMES.some((s) => s.name === two && s.name.length === 2);
  if (isCompoundSurname && fullName.length >= 3) {
    return fullName.substring(2);
  }
  return fullName.substring(1);
}

// 본인 이름이 출생 시기 인기 명단에 있으면 점유율·순위 반환
// 없으면 null (행안부 공개 명단 밖)
export function findNameStat(
  fullName: string,
  birthYear: number,
  gender: "M" | "F"
): { share: number; rank: number; decade: string } | null {
  const firstName = extractFirstName(fullName);
  if (!firstName) return null;
  const decade = decadeKey(birthYear);
  const stats = NAME_STATS_BY_DECADE[decade] || [];
  // 동성만 필터링 후 점유율 내림차순 정렬
  const sameGender = stats
    .filter((s) => s.gender === gender)
    .sort((a, b) => b.share - a.share);
  const idx = sameGender.findIndex((s) => s.name === firstName);
  if (idx === -1) return null;
  return { share: sameGender[idx].share, rank: idx + 1, decade };
}

// 등급 분류 (점유율 기반)
export function nameCommonness(
  share: number | null
): "very_common" | "common" | "uncommon" | "rare" {
  if (share === null) return "rare";
  if (share >= 0.015) return "very_common";
  if (share >= 0.008) return "common";
  if (share >= 0.003) return "uncommon";
  return "rare";
}

// 정규분포 누적분포함수 (CDF) — Z-score → 백분위
export function normalCdf(z: number): number {
  // Abramowitz & Stegun 근사 공식 (정확도 1.5e-7)
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// 한국 누적 출생자 수 (1925년 1월 1일부터 입력 날짜까지)
export function cumulativeBirthsUntil(year: number, month: number, day: number): number {
  let total = 0;
  for (let y = 1925; y < year; y++) {
    total += BIRTHS_BY_YEAR[y] ?? 0;
  }
  // 해당 연도 일수 비율
  const yearBirths = BIRTHS_BY_YEAR[year] ?? BIRTHS_BY_YEAR[2024];
  const daysInYear =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  const dayOfYear = dayOfYearFromMonthDay(year, month, day);
  total += Math.round((yearBirths * dayOfYear) / daysInYear);
  return total;
}

function dayOfYearFromMonthDay(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  const start = new Date(year, 0, 1);
  const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1;
}

// 동기 인구 추정: 출생자 수 × 해당 코호트 생존율
// 생존율은 통계청 생명표 기준 단순 보정 (연령대별)
export function survivorsOfBirthYear(birthYear: number, currentYear: number): number {
  const births = BIRTHS_BY_YEAR[birthYear];
  if (!births) return 0;
  const age = currentYear - birthYear;
  // 단순 생존율 곡선 (통계청 2022 완전생명표 근사)
  let survivalRate: number;
  if (age < 10) survivalRate = 0.997;
  else if (age < 20) survivalRate = 0.995;
  else if (age < 30) survivalRate = 0.99;
  else if (age < 40) survivalRate = 0.985;
  else if (age < 50) survivalRate = 0.975;
  else if (age < 60) survivalRate = 0.95;
  else if (age < 70) survivalRate = 0.89;
  else if (age < 80) survivalRate = 0.74;
  else if (age < 90) survivalRate = 0.45;
  else survivalRate = 0.15;
  return Math.round(births * survivalRate);
}
