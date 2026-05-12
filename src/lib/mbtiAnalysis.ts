// MBTI 4축 깊이 분석 + 한국 실전 연애 시나리오

const TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

// 황금 조합 (MBTI 이론 + 한국 커뮤니티 데이터)
const BEST_PAIRS: Record<string, string[]> = {
  "INTJ": ["ENFP", "ENTP"], "INTP": ["ENTJ", "ESTJ"], "ENTJ": ["INTP", "INFP"], "ENTP": ["INFJ", "INTJ"],
  "INFJ": ["ENFP", "ENTP"], "INFP": ["ENFJ", "ENTJ"], "ENFJ": ["INFP", "ISFP"], "ENFP": ["INTJ", "INFJ"],
  "ISTJ": ["ESFP", "ESTP"], "ISFJ": ["ESFP", "ESTP"], "ESTJ": ["ISFP", "ISTP"], "ESFJ": ["ISFP", "ISTP"],
  "ISTP": ["ESTJ", "ESFJ"], "ISFP": ["ENFJ", "ESFJ"], "ESTP": ["ISTJ", "ISFJ"], "ESFP": ["ISTJ", "ISFJ"],
};

// 환장의 조합 (최악 매치 — 한국 커뮤니티에서 자주 언급)
const WORST_PAIRS: Record<string, string[]> = {
  "INTJ": ["ESFJ", "ESFP"], "INTP": ["ESFJ", "ENFJ"], "ENTJ": ["ISFP", "INFP"], "ENTP": ["ISFJ", "ISTJ"],
  "INFJ": ["ESTP", "ESTJ"], "INFP": ["ESTJ", "ENTJ"], "ENFJ": ["ISTP", "INTP"], "ENFP": ["ISTJ", "ESTJ"],
  "ISTJ": ["ENFP", "ENTP"], "ISFJ": ["ENTP", "ESTP"], "ESTJ": ["INFP", "ENFP"], "ESFJ": ["INTP", "INTJ"],
  "ISTP": ["ENFJ", "ESFJ"], "ISFP": ["ENTJ", "ESTJ"], "ESTP": ["INFJ", "INTJ"], "ESFP": ["INTJ", "ISTJ"],
};

export type AxisAnalysis = {
  axis: string;
  matched: boolean;
  title: string;
  detail: string;
  example?: string;
};

export type Analysis = {
  score: number;
  type: string;
  longDescription: string;
  axes: AxisAnalysis[];
  loveExpression: { yours: string; theirs: string };
  dateStyle: string;
  conflictPattern: string;
  triggers: { yours: string; theirs: string };
  longTermTip: string;
  romance: number;
  work: number;
  friendship: number;
  // 신규 — 실전 연애 섹션
  firstImpression: string;
  katokVibe: string;
  forbiddenWords: { yours: string[]; theirs: string[] };
  breakupSign: string;
};

// ============================================================
// 4축 분석 — 실전 사례 (카톡·기념일·여행·싸움) 포함
// ============================================================

function eIAnalysis(a: string, b: string): AxisAnalysis {
  const sameE = a[0] === "E";
  if (a[0] === b[0]) {
    return {
      axis: "외향 ↔ 내향 (E/I)",
      matched: true,
      title: sameE ? "둘 다 외향형 (E·E)" : "둘 다 내향형 (I·I)",
      detail: sameE
        ? "둘 다 사람 만나면서 에너지 받는 타입. 주말마다 약속 잡고 새로운 모임 찾아다니는 게 자연스러움. 같이 클럽·페스티벌·여행 가도 둘 다 끝까지 신남."
        : "조용한 카페·집데이트가 진짜 데이트. 둘 다 \"오늘 약속 안 잡혔어\" = 행복인 타입. 1시간 같이 있다가 각자 핸드폰 봐도 어색하지 않은 관계.",
      example: sameE
        ? "💡 함정: 단둘이 깊은 대화 시간 부족 → 6개월쯤 \"우리 친구냐 연인이냐\" 위기. 주 1회 \"오늘 약속 다 거절하고 우리만\" 정해두기."
        : "💡 함정: 둘 다 \"네가 먼저 나가자고 해\" 기다리다 6개월 집데이트만 함 → 매너리즘. 한 달 한 번은 새 장소·새 사람 만남 강제 권장.",
    };
  }
  return {
    axis: "외향 ↔ 내향 (E/I)",
    matched: false,
    title: "외향(E) ↔ 내향(I) — 배터리 종류가 다름",
    detail:
      "E는 사람 만나면 충전, I는 혼자 있어야 충전. 같이 결혼식 다녀온 토요일, E는 \"기분 좋다 한 잔 더?\" / I는 \"진짜 진 빠진다 자고 싶다\". 이걸 \"애정 부족\"으로 오해하면 끝.",
    example:
      "💡 E의 \"오늘 친구들이랑 술 마시러 갈게\"를 I가 \"왜 나랑 안 있어\"로 받지 말기. 반대로 I의 \"오늘은 혼자 있고 싶어\"를 E가 \"날 싫어하나\"로 받지 말기. 각자 충전 끝나면 더 잘 맞음.",
  };
}

function nSAnalysis(a: string, b: string): AxisAnalysis {
  const sameN = a[1] === "N";
  if (a[1] === b[1]) {
    return {
      axis: "직관 ↔ 감각 (N/S)",
      matched: true,
      title: sameN ? "둘 다 직관형 (N·N)" : "둘 다 감각형 (S·S)",
      detail: sameN
        ? "새벽 3시까지 \"우주는 왜 존재하지\", \"우리가 죽으면 어떻게 될까\" 같은 토크 가능한 사이. 같은 영화 보고 30분간 \"감독이 진짜 말하고 싶었던 건…\" 토론 가능."
        : "\"오늘 뭐 먹지\" 5분이면 결정. 둘 다 현실 감각 좋아서 가계부·일정·약속 다 정확. 여행 가면 \"OO이 맛집이래\" 사전 조사하고 동선 짜기.",
      example: sameN
        ? "⚠️ 함정: 둘 다 일상 디테일 놓침. 가스밸브·차 검사·집세 납부 같은 거 자주 까먹음. 한 명은 캘린더 알림·자동이체 담당 권장."
        : "⚠️ 함정: \"5년 후 우리 어떻게 살까?\" 같은 큰 그림 대화 부족. 안정적이지만 새 시도 적어 매너리즘 위험. 분기에 한 번 인생 토크 권장.",
    };
  }
  return {
    axis: "직관 ↔ 감각 (N/S) — 가장 큰 차이",
    matched: false,
    title: "직관(N) ↔ 감각(S) — 같은 영화 보고 다른 영화 본 느낌",
    detail:
      "N은 \"의미·메시지·가능성\"을 보고, S는 \"사실·디테일·현재\"를 봄. 같은 데이트 다녀와서 N은 \"오늘 분위기가 묘했지\", S는 \"그 식당 파스타가 좀 짰어\"라 말함. 안경 색이 달라서 같은 세계가 다르게 보임.",
    example:
      "💡 N이 \"왠지 이 사람 별로야\" 하면 S는 \"근거가 뭔데?\" 묻지 말고 \"그래?\" 일단 듣기. S가 디테일 챙기면 N은 \"왜 그런 작은 거에 신경 써\" 하지 말기. 일상은 S, 비전은 N이 끌어가는 분담이 최강.",
  };
}

function tFAnalysis(a: string, b: string): AxisAnalysis {
  const sameT = a[2] === "T";
  if (a[2] === b[2]) {
    return {
      axis: "사고 ↔ 감정 (T/F)",
      matched: true,
      title: sameT ? "둘 다 사고형 (T·T)" : "둘 다 감정형 (F·F)",
      detail: sameT
        ? "싸워도 빠르게 \"뭐가 문제고 어떻게 풀지\" 모드. 감정 안 끌고 가서 깔끔. 다만 \"오늘 회사에서 짜증 났어\" 했을 때 둘 다 \"그래서 뭐 어떻게 할 건데?\" 하는 게 함정."
        : "서로 \"오늘 기분 어땠어?\" 자연스럽게 묻는 관계. 공감·위로 만렙이라 깊은 정서적 친밀감 빨리 형성. 영화 보면서 같이 울고, 친구 얘기에 같이 분노.",
      example: sameT
        ? "💡 함정: 정서적 케어 부족. 결론 내리기 전 \"마음은 좀 어때?\" 한 번 물어주는 연습. 안 그러면 사무적인 관계로 빠짐."
        : "💡 함정: 큰 결정에서 정에 휘둘림. 부모님·친구 때문에 손해 보는 선택 자주. 큰 금융·진로는 \"감정 빼고 사실만\" 한 번 검토 권장.",
    };
  }
  return {
    axis: "사고 ↔ 감정 (T/F)",
    matched: false,
    title: "사고(T) ↔ 감정(F) — 위로 한 마디에 갈리는 사이",
    detail:
      "F가 \"오늘 진짜 힘들었어\" 하면, T는 \"그래서 뭐 어떻게 할까\"·F는 \"많이 힘들었겠다\"가 자동 반응. T 입장에선 \"해결책 = 사랑\"인데, F 입장엔 \"공감 = 사랑\". 이거 하나로 1년차 부부도 이혼 직전 감.",
    example:
      "💡 T는 결론·조언 던지기 전 \"많이 힘들었겠다\" 한 마디 먼저. F는 T의 직설을 \"날 사랑 안 함\"으로 받지 말기 — T 입장에선 그게 진심 어린 도와주려는 거. \"공감 30초 → 해결 70%\" 룰 권장.",
  };
}

function jPAnalysis(a: string, b: string): AxisAnalysis {
  const sameJ = a[3] === "J";
  if (a[3] === b[3]) {
    return {
      axis: "판단 ↔ 인식 (J/P)",
      matched: true,
      title: sameJ ? "둘 다 판단형 (J·J)" : "둘 다 인식형 (P·P)",
      detail: sameJ
        ? "데이트 전날 \"내일 11시 OO역 1번 출구, 12시 OO식당 예약, 2시 영화, 4시 카페\" 메시지 가능. 약속 5분 전 도착 디폴트. 둘 다 계획적이라 결혼 준비·여행 준비 다 수월."
        : "여행 첫날 \"오늘 뭐 할까?\" 시작. 둘 다 \"가서 봐 가서\" 가능. 계획 안 짜도 어디든 즐거움. 즉흥 데이트·해외 여행 시 둘 다 stress 없음.",
      example: sameJ
        ? "⚠️ 함정: 매너리즘. 데이트 코스가 6개월째 비슷. \"이번 주말은 계획 없이 그냥 나가자\" 같은 의도적 즉흥성 1달 1번 추천."
        : "⚠️ 함정: 비행기 표·결혼 등록·세금 같은 거 막판에 몰림. 둘 다 \"누가 하겠지\" 미루다 사고 남. 큰 마감 1개는 무조건 캘린더 알림 등록.",
    };
  }
  return {
    axis: "판단 ↔ 인식 (J/P)",
    matched: false,
    title: "판단(J) ↔ 인식(P) — 여행 첫날부터 다투는 사이",
    detail:
      "J는 \"내일 9시 호텔 출발, 10시 박물관, 12시 점심 예약\" 짜놓고 오는데, P는 \"가서 봐가서\" 도착. J 입장엔 P가 무책임해 보이고, P 입장엔 J가 강박. \"왜 미리 정해야 해? 답답해\" vs \"왜 미리 안 정해? 불안해\" 패턴 반복.",
    example:
      "💡 J는 P의 \"천천히 정하자\"를 \"무계획\"이 아닌 \"여유\"로 받기. P는 비행기·결혼식·세금 같은 큰 마감만큼은 J 따라가기. 일상은 P, 큰 일정은 J가 끌고 가는 분담이 정답.",
  };
}

// ============================================================
// 사랑 표현 방식 — 실전 행동으로
// ============================================================

function loveExpressionFor(type: string): string {
  const map: Record<string, string> = {
    INTJ: "\"너 위해서 이거 알아봤어\" — 실용·계획·문제 해결로 사랑 표현. 말로는 어색해도 행동으로 다 챙김. 기념일 케이크보다 본인 노트북 고장난 거 미리 고쳐줌.",
    INTP: "갑자기 본인 관심사 깊이 공유 = 사랑 신호. \"이거 진짜 신기한데 들어볼래?\" 가 \"널 특별하게 본다\" 의미. 표현은 어색하지만 본인 세계 들여보내주는 게 최고 신뢰.",
    ENTJ: "본인 인생 계획에 상대 포함 = 사랑 표현. \"3년 후 우리 둘이 OO 하자\" 가 \"평생 갈 사람\" 의미. 행동·성취·미래 비전 공유로 사랑 표현.",
    ENTP: "함께 새 경험·도전·토론으로 사랑 표현. 데이트 코스가 \"내가 좋아하는 코스\"가 아니라 \"우리만 가본 곳\". 똑똑한 농담·말장난·놀림이 친밀감 표현.",
    INFJ: "상대 한 마디로 마음 다 읽음. 말하기 전에 \"오늘 좀 힘들었지?\" 먼저 알아챔. 깊은 1:1 대화·진심 어린 편지·\"네가 행복했으면\" 같은 진심으로 사랑 표현.",
    INFP: "감정·시·노래·편지·이벤트로 사랑 표현. \"오늘 너랑 같이 들으면 좋을 노래\" 보냄. 본인 깊은 감정·트라우마 나누는 것 자체가 최고 신뢰 표시.",
    ENFJ: "상대 인생 적극 챙김. 친구·가족 안부까지 다 기억. \"네 어머니 생신 다음 주야\" 챙기는 사람. 깊은 칭찬·격려·\"네가 잘되면 좋겠어\" 진심으로 표현.",
    ENFP: "본인 세계 다 보여주기. 친구·가족 다 소개. \"우리 같이 OO 해보자!\" 신난 톤으로 사랑 표현. 갑작스러운 선물·로맨틱 이벤트·SNS 자랑 다 적극.",
    ISTJ: "꾸준한 책임·약속 지킴·실용 선물로 사랑 표현. \"사랑해\" 매일 말 안 해도 매일 챙겨주는 행동. 기념일·생일 절대 안 까먹음. 한번 결정하면 평생.",
    ISFJ: "디테일 다 기억. 좋아하는 음식·알레르기·취향·작은 습관까지 다 외움. \"네가 좋아하는 거\" 챙겨주는 게 사랑 표현. 갈등 시 본인이 먼저 양보.",
    ESTJ: "보호·책임·관리로 사랑 표현. \"우리 가정 내가 책임진다\" 마인드. 직설적 \"사랑해\" 보단 \"내가 다 알아서 할게\" 행동으로. 미래 계획·경제력 안정으로 신뢰 줌.",
    ESFJ: "기념일·생일·작은 이벤트 다 챙김. 사랑하는 사람 위해 음식·선물·서프라이즈 매번. 가족·친구 적극 챙김. 표현·말·접촉 다 활발.",
    ISTP: "함께 새 활동·취미·기술 공유로 사랑 표현. 본인 도구·기술·시간 내주는 게 \"널 위해서\" 의미. 말로는 어색해도 위기 시 가장 든든.",
    ISFP: "분위기·감각·디테일로 사랑 표현. 같이 음악 듣기·예술 감상·자연 여행. 말은 적지만 작은 손길·표정·작은 선물에 진심 가득.",
    ESTP: "재미·모험·새 경험으로 사랑 표현. \"이거 같이 해보자!\" 가 \"너랑 시간 보내고 싶어\". 상대 즐겁게 해주는 게 사랑. 진지한 감정 토크는 어색.",
    ESFP: "사람들 앞에 자랑·SNS 공유·이벤트로 사랑 표현. 친구·가족에게 \"우리 자기\" 자랑이 사랑의 언어. 분위기·재미·즐거운 시간이 사랑의 본질.",
  };
  return map[type] || "각자만의 방식으로 표현";
}

// ============================================================
// 데이트 스타일
// ============================================================

function dateStyleFor(a: string, b: string): string {
  const isNF1 = a[1] === "N" && a[2] === "F", isNF2 = b[1] === "N" && b[2] === "F";
  const isNT1 = a[1] === "N" && a[2] === "T", isNT2 = b[1] === "N" && b[2] === "T";
  const isSJ1 = a[1] === "S" && a[3] === "J", isSJ2 = b[1] === "S" && b[3] === "J";
  const isSP1 = a[1] === "S" && a[3] === "P", isSP2 = b[1] === "S" && b[3] === "P";

  if (isNF1 && isNF2) return "💕 감성 풀코스 — 한적한 카페에서 인생 토크 → 미술관·전시회 → 분위기 좋은 와인바 → 밤 산책. 둘 다 \"오늘 진짜 좋았다\" 마무리. 인스타 스토리 감성샷 필수.";
  if (isNT1 && isNT2) return "🧠 지적 자극 코스 — 이색 박물관·전시·재즈바·새로운 도시 가서 \"이게 어떻게 작동하지?\" 같이 분석. 데이트 자체가 토론. 영혼의 단짝.";
  if (isSJ1 && isSJ2) return "🍽️ 예약·계획·안정 — 한 달 전 예약한 미슐랭·뮤지컬·연극. 약속 5분 전 도착. 데이트 코스 완벽. 둘 다 만족도 100%.";
  if (isSP1 && isSP2) return "🎢 즉흥·액티비티 — \"오늘 뭐할까?\" 시작해서 클럽·서핑·번지·즉흥 여행. 둘 다 \"어디든 좋아!\" 가능. 함께 있는 자체가 모험.";
  if ((isNF1 && isNT2) || (isNT1 && isNF2)) return "💬 N·N 토크 데이트 — 깊은 카페에서 5시간 인생·우주·미래 토크. 같은 영화 보고 30분 분석. 머리·마음 둘 다 충전.";
  if ((isSJ1 && isSP2) || (isSP1 && isSJ2)) return "⚖️ 계획 + 즉흥 — 한 명이 코스 잡으면 한 명이 도중에 \"여기 들러볼까?\" 가능. 1주는 J 주도, 1주는 P 주도가 황금 비율.";
  return "🎨 서로 다른 데이트 번갈아 — 한 주는 액티비티, 한 주는 깊은 대화. 둘 다 \"가끔은 색다른 게 좋아\" 인정하면 매주 새로움.";
}

// ============================================================
// 갈등 해결 패턴
// ============================================================

function conflictPatternFor(a: string, b: string): string {
  const sameT = a[2] === b[2];
  const bothF = a[2] === "F" && b[2] === "F";
  if (bothF) return "🌊 감정 폭발 → 둘 다 울음 → 안고 화해. 사실 검토는 부족해서 같은 싸움 반복 위험. 큰 결정은 \"감정 빼고 다시 한 번\" 권장.";
  if (sameT && a[2] === "T") return "📊 \"누가 잘못했는지\" 빠르게 정리 → 결론 → 끝. 깔끔하지만 감정 케어 부족. \"결론 좋은데 너 기분은 좀 풀렸어?\" 한 번 묻기.";
  return "⚡ T·F 폭탄 — 가장 자주 폭발하는 패턴. T가 \"왜 그게 화났어?\" 물으면 F가 더 폭발. F가 \"기분이 안 좋아\" 하면 T는 \"이유가 뭔데?\" → 폭발. 갈등 시 즉답 X, 1시간 후 다시. T는 공감 먼저, F는 사실 인정 먼저.";
}

// ============================================================
// 스트레스 트리거 — 더 직설적·구체적
// ============================================================

function triggerFor(type: string): string {
  const map: Record<string, string> = {
    INTJ: "\"왜 그렇게 무뚝뚝해?\" 같은 감정 강요 / 비논리적 떼쓰기 / 본인 시간 강제 침해 / 작은 일에 큰 감정 폭발",
    INTP: "감정으로 압박 / \"내 마음 좀 알아줘\" 강요 / 정해진 일정 강제 / 토론에서 논리 무시하고 \"그냥\" 답변",
    ENTJ: "비효율적 결정 / 끝없는 망설임 / 책임 회피 / \"왜 그렇게 차가워?\" 비난",
    ENTP: "정해진 루틴 강요 / 새로운 시도 거부 / 토론 거부 / 본인 페이스 강제 맞춤",
    INFJ: "본인 깊은 감정 무시 / 공감 없는 직설 / 시끄러운 사람 많은 환경 강제 / \"너무 예민하다\" 비난",
    INFP: "감정 강제 표현 요구 / 본인 가치관 비웃음 / 갈등 강제 직면 / \"왜 그렇게 비현실적이야?\"",
    ENFJ: "본인 케어를 \"오버한다\"로 받음 / 거리 두기 / 감정 무시 / 본인 진심을 조작이라 의심",
    ENFP: "본인 즉흥성 비난 / 감정·열정 차단 / 너무 진지한 분위기 강제 / 자유 박탈",
    ISTJ: "약속 어김 / 갑작스러운 일정 변경 / 책임 회피 / \"좀 더 즉흥적이면 좋겠어\" 요구",
    ISFJ: "본인 노력 당연시 / 감사 표현 부족 / 갈등 강제 정면돌파 / 본인을 \"착하기만 해\"로 받음",
    ESTJ: "비효율·무능 / 결정 미루기 / 본인 권위 무시 / \"왜 그렇게 강박이야?\"",
    ESFJ: "기념일·디테일 까먹음 / 감사 표현 부족 / 본인 챙김을 부담스러워함 / 차가운 반응",
    ISTP: "감정 강요 / 본인 공간·시간 침해 / 끝없는 잔소리 / 진지한 \"우리 관계 얘기 좀 해\"",
    ISFP: "본인 가치관·예술 감각 무시 / 감정 강제 표현 요구 / 시끄러운 환경 / 강제 사교",
    ESTP: "심각한 분위기 / 미래 걱정·계획 강요 / 갑작스러운 진지함 / 감정 깊이 분석",
    ESFP: "재미·즐거움 차단 / 비판·분석 위주 대화 / 본인 즉흥성 비난 / 너무 진지한 관계",
  };
  return map[type] || "각자의 trigger 있음";
}

// ============================================================
// 장기 관계 팁
// ============================================================

function longTermTipFor(matches: number, score: number): string {
  if (score >= 90) return "🌟 황금 매치 — 자동으로 잘 맞아 노력 안 해도 OK일 것 같지만 함정. 너무 편해서 \"고마움\" 잊기 쉬움. 분기 1번 \"너 덕분에 OO 됐어\" 표현 의식적으로.";
  if (matches === 4) return "👯 거의 똑같은 유형 — 너무 편해서 자극·성장 부족. 매년 새로운 취미·여행·도전 1개씩 같이 시도. 안 그러면 1~2년에 매너리즘.";
  if (matches >= 3) return "✨ 가치관 일치 — 일상 결정 빠르고 안정적. 한쪽이 약한 영역(계획·감정 케어)은 외부 도움(친구·전문가) 받기. 모든 걸 둘이 해결하려 하지 말기.";
  if (matches === 2) return "⚖️ 균형형 — 같은 부분·다른 부분 절반씩. 다른 축은 \"성격 결함\"이 아닌 \"역할 분담\"으로 받으면 시너지 최강. 매주 일요일 \"이번 주 어땠어?\" 정기 점검.";
  if (matches === 1) return "🔄 보완형 — 끌림 ↑ 갈등 ↑ 패키지. 1년차에 \"이 사람이 진짜 맞는 사람인가\" 의문 자주. 그 시점 넘기면 평생 잘 맞음. 매주 정기 대화 + 1년차 위기 미리 알고 대비.";
  return "🎢 정반대형 — 가장 자극적이지만 가장 어려운 관계. \"왜 저렇게 행동하지?\"가 매일 발생. 다름을 \"매력\"으로 받는 멘탈 + 공통 취미 1~2개 만들기 + 갈등 시 즉답 금지 룰 필수.";
}

// ============================================================
// 신규 — 첫 만남 케미
// ============================================================

function firstImpressionFor(a: string, b: string): string {
  const score = compatScore(a, b);
  const sameN = a[1] === b[1];
  const sameF = a[2] === "F" && b[2] === "F";

  if (score >= 90) {
    return `💘 첫 만남에 \"이 사람 뭔가 달라\" 느낌 강함. 30분 대화 후 \"우리 어디서 만난 적 있나?\" 같은 익숙함. 평소 안 하는 행동(전화번호 먼저 묻기·다음 약속 즉시 잡기) 자연스럽게 나옴. 위험: 빠진 만큼 빠르게 식는 함정도 같이 옴.`;
  }
  if (score >= 80) {
    return `😊 첫 인상 \"괜찮은데?\" 정도. 폭발적 끌림보단 편안함. 2~3번 만나면서 점점 \"이 사람 진짜 좋다\" 깨닫는 슬로우 빌딩형. 친구로 시작해서 연인 가는 패턴 많음.`;
  }
  if (score >= 65) {
    if (sameN && sameF) return "🌫️ 첫 만남 평범. \"좀 통하는 부분 있다\" 수준. 깊은 대화 시작되면 갑자기 잘 통함을 발견. 평범 → 친밀로 점프 포인트 있음.";
    return "🤔 첫 만남 호불호 갈림. 한쪽이 \"신선해\" 느낄 때 다른 쪽은 \"좀 부담스러워\" 가능. 시간 줘서 서로 적응되면 의외로 잘 맞음.";
  }
  return "⚡ 첫 만남부터 충돌 또는 극단적 호기심. \"저 사람 도대체 뭐지?\" 가 끌리는 사람과 부담스러운 사람 갈림. 정반대라 사귀면 자극 ↑·싸움 ↑. 진지한 관계로 가려면 자기 멘탈 강해야.";
}

// ============================================================
// 신규 — 카톡 케미
// ============================================================

function katokVibeFor(a: string, b: string): string {
  const replyA = replyStyleOf(a);
  const replyB = replyStyleOf(b);
  const sameSpeed = replyA.speed === replyB.speed;
  const sameDepth = replyA.depth === replyB.depth;

  if (sameSpeed && sameDepth) {
    return `📱 카톡 케미 ⭐⭐⭐⭐⭐ — 둘 다 ${replyA.speed === "fast" ? "답장 빠름" : "답장 천천히"} + ${replyA.depth === "long" ? "긴 문장" : "짧고 효율"}. 같은 속도·깊이라 답장 기다리며 안 답답함. 카톡 패턴 갈등 거의 없음.`;
  }
  if (sameSpeed) {
    return `📱 카톡 케미 ⭐⭐⭐⭐ — 답장 속도는 비슷한데 문장 길이 차이. ${replyA.depth === "long" ? a + "은 길게, " + b + "는 짧게" : a + "은 짧게, " + b + "는 길게"} 답함. 처음엔 어색해도 적응됨.`;
  }
  if (sameDepth) {
    return `📱 카톡 케미 ⭐⭐⭐ — 답장 길이는 비슷한데 속도 차이. ${replyA.speed === "fast" ? a + "은 즉답, " + b + "는 몇 시간 후" : a + "은 천천히, " + b + "는 즉답"}. 답장 기다리는 쪽이 \"왜 늦어?\" 답답함 자주.`;
  }
  return `📱 카톡 케미 ⭐⭐ — 속도·길이 다 다름. ${replyA.speed === "fast" && replyA.depth === "long" ? a + "은 즉답+긴 문장, " + b + "는 \"ㅇㅇ\"" : a + "은 \"ㅇㅇ\", " + b + "는 즉답+긴 문장"}. \"날 사랑 안 하나?\" 오해 자주 발생. 카톡 스타일 차이 미리 인지하고 맞춰가야 함.`;
}

type ReplyStyle = { speed: "fast" | "slow"; depth: "long" | "short" };

function replyStyleOf(type: string): ReplyStyle {
  const e = type[0], n = type[1], f = type[2], j = type[3];
  const speed: "fast" | "slow" = e === "E" || (j === "J" && f === "F") ? "fast" : "slow";
  const depth: "long" | "short" = n === "N" && f === "F" ? "long" : (n === "S" && f === "T" ? "short" : "long");
  return { speed, depth };
}

// ============================================================
// 신규 — 금기어 (이런 말 하면 끝)
// ============================================================

function forbiddenWordsFor(type: string): string[] {
  const map: Record<string, string[]> = {
    INTJ: ["\"왜 그렇게 차가워?\"", "\"좀 더 감정적이면 좋겠어\"", "\"네 계획 좀 미뤄도 되잖아\"", "\"넌 너무 분석적이야\""],
    INTP: ["\"왜 답이 그게 다야?\"", "\"좀 더 챙겨줘\"", "\"왜 항상 모호해?\"", "\"논리 좀 그만\""],
    ENTJ: ["\"왜 그렇게 강박이야\"", "\"좀 천천히 가\"", "\"너 너무 통제하려 해\"", "\"그게 그렇게 중요해?\""],
    ENTP: ["\"왜 또 새로운 거?\"", "\"왜 한 가지에 집중 못 해?\"", "\"좀 진지해져\"", "\"네 농담 안 웃겨\""],
    INFJ: ["\"너 너무 예민해\"", "\"왜 그렇게 깊게 생각해?\"", "\"네가 오버 해석한 거야\"", "\"좀 가볍게 살아\""],
    INFP: ["\"왜 그렇게 비현실적이야?\"", "\"꿈 좀 깨\"", "\"네 감정만 중요해?\"", "\"네 가치관 좀 바꿔\""],
    ENFJ: ["\"오버하지 마\"", "\"너 너무 챙겨\"", "\"왜 그렇게 다 신경 써?\"", "\"네 진심 의심돼\""],
    ENFP: ["\"좀 진지해\"", "\"왜 또 흥분해?\"", "\"네 열정 부담스러워\"", "\"넌 너무 산만해\""],
    ISTJ: ["\"좀 즉흥적이면 좋겠어\"", "\"왜 그렇게 융통성 없어?\"", "\"규칙이 그렇게 중요해?\"", "\"네 답답해\""],
    ISFJ: ["\"왜 그렇게 다 받아줘?\"", "\"좀 자기 주장 해\"", "\"왜 네 의견은 없어?\"", "\"네 헌신 당연하지\""],
    ESTJ: ["\"넌 너무 강압적이야\"", "\"왜 항상 네가 결정해?\"", "\"좀 부드럽게 말해\"", "\"네 방식이 다 옳아?\""],
    ESFJ: ["\"오버하지 마\"", "\"왜 다 챙겨?\"", "\"네 챙김 부담스러워\"", "\"기념일 그렇게 중요해?\""],
    ISTP: ["\"왜 그렇게 무뚝뚝해?\"", "\"우리 관계 얘기 좀 해\"", "\"좀 표현 해\"", "\"네 마음 모르겠어\""],
    ISFP: ["\"왜 의견이 없어?\"", "\"좀 직접 말해\"", "\"네 가치관 비현실적이야\"", "\"넌 너무 조용해\""],
    ESTP: ["\"좀 진지해\"", "\"미래 생각 좀 해\"", "\"왜 그렇게 즉흥적이야?\"", "\"넌 너무 가볍게 봐\""],
    ESFP: ["\"좀 차분해\"", "\"왜 항상 사람들에 둘러싸여?\"", "\"분위기 깨지 마\"", "\"넌 너무 가벼워\""],
  };
  return map[type] || ["일반적인 부정 표현 다"];
}

// ============================================================
// 신규 — 이별 사인
// ============================================================

function breakupSignFor(a: string, b: string): string {
  const score = compatScore(a, b);
  const sameT = a[2] === "T" && b[2] === "T";
  const tfMix = (a[2] === "T" && b[2] === "F") || (a[2] === "F" && b[2] === "T");

  if (score >= 90) {
    return "💚 깨질 가능성 낮음. 큰 외부 충격(이사·가족 반대·바람) 없으면 장기 안정. 위기 사인: 둘 다 \"고마움\" 표현 줄어들 때 — 너무 편해서 당연시 시작이 첫 적신호.";
  }
  if (score >= 75) {
    return "💛 보통 안정. 위기 사인: 한쪽이 카톡 답장 점점 짧아짐 → 데이트 횟수 줄어듦 → \"오늘 좀 피곤해\" 빈도 ↑. 3주 이상 이 패턴이면 1번 진심 대화 필요.";
  }
  if (tfMix) {
    return "⚠️ T·F 차이로 깨지는 패턴. 위기 사인: F가 \"마음 안 알아준다\" 자주 말 → T가 \"또 그 얘기야\" 답답함 → F가 점점 \"나 진짜 힘들어\" 빈도 ↑인데 T는 같은 톤. 6개월 누적되면 위험.";
  }
  if (score >= 60) {
    return "🟡 평범. 위기 사인: 같은 싸움 3번 이상 반복 → 한쪽이 \"이번엔 진짜 마지막\" 말함 → 일주일 카톡 끊김. 이 패턴 2번 반복이면 80% 1년 안에 헤어짐.";
  }
  return "🔴 깨지기 쉬운 조합. 위기 사인: 1~3개월차 \"이 사람 진짜 맞나?\" 의문 자주 → 친구·가족에게 상의 빈도 ↑ → 데이트가 의무처럼 느껴짐. 이 단계에서 진지한 대화 안 하면 6개월 못 감.";
}

// ============================================================
// 종합 점수 — 분포 확장 (30~99)
// ============================================================

function compatScore(a: string, b: string): number {
  const sameE = a[0] === b[0], sameN = a[1] === b[1], sameT = a[2] === b[2], sameJ = a[3] === b[3];
  const matches = [sameE, sameN, sameT, sameJ].filter(Boolean).length;

  if (BEST_PAIRS[a]?.includes(b)) return 95 + (a === b ? 0 : Math.floor(Math.random() * 4));
  if (WORST_PAIRS[a]?.includes(b)) return 35 + Math.floor(Math.random() * 10);
  if (a === b) return 78;
  if (matches === 4) return 78;
  if (matches === 3) return 82 + Math.floor(Math.random() * 5);
  if (matches === 2) return 68 + Math.floor(Math.random() * 8);
  if (matches === 1) return 55 + Math.floor(Math.random() * 10);
  return 45 + Math.floor(Math.random() * 10);
}

// 결정론적 점수 (해시 기반) — 같은 조합에 항상 같은 점수
function deterministicScore(a: string, b: string): number {
  const sameE = a[0] === b[0], sameN = a[1] === b[1], sameT = a[2] === b[2], sameJ = a[3] === b[3];
  const matches = [sameE, sameN, sameT, sameJ].filter(Boolean).length;

  // 해시 (간단)
  let hash = 0;
  const key = a < b ? a + b : b + a;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const jitter = hash % 6;

  if (BEST_PAIRS[a]?.includes(b)) return 92 + (jitter % 8);
  if (WORST_PAIRS[a]?.includes(b)) return 32 + (jitter % 12);
  if (a === b) return 76 + (jitter % 4);
  if (matches === 4) return 76 + (jitter % 4);
  if (matches === 3) return 80 + (jitter % 7);
  if (matches === 2) return 66 + (jitter % 10);
  if (matches === 1) return 52 + (jitter % 12);
  return 42 + (jitter % 12);
}

// ============================================================
// 종합 분석
// ============================================================

export function fullAnalyze(a: string, b: string): Analysis {
  const sameE = a[0] === b[0], sameN = a[1] === b[1], sameT = a[2] === b[2], sameJ = a[3] === b[3];
  const matches = [sameE, sameN, sameT, sameJ].filter(Boolean).length;

  const score = deterministicScore(a, b);

  let type: string;
  if (score >= 90) type = "🔥 운명적 매치 — 황금 조합";
  else if (score >= 80) type = "✨ 안정형 매치 — 일상에서 잘 맞음";
  else if (score >= 70) type = "😊 무난한 매치 — 노력하면 좋음";
  else if (score >= 55) type = "⚖️ 도전형 매치 — 끌림과 갈등 공존";
  else if (score >= 45) type = "⚡ 폭발형 매치 — 자극은 강하나 충돌 잦음";
  else type = "🚨 환장의 조합 — 평생 가려면 의식적 노력 필수";

  const longDescription =
    score >= 90 ? `${a} ↔ ${b}는 MBTI 이론에서 \"황금 조합\"으로 가장 자주 언급되는 매치입니다. 한쪽이 약한 영역(예: ${a}의 감정 표현, ${b}의 계획성)을 다른 쪽이 자연스럽게 채워주는 보완 관계라 첫 만남부터 \"이 사람 뭔가 달라\" 느끼는 경우가 많아요. 다만 \"끌림 = 영원한 행복\"은 환상이고, 진짜 장기 관계는 다름을 \"매력\"으로 받는 멘탈 + 정기적인 대화 + 서로의 영역 인정에서 결정됩니다.` :
    score >= 80 ? `${a} ↔ ${b}는 비슷한 가치관·결정 방식을 가져 일상에서 큰 마찰 없이 잘 맞는 조합. 다만 너무 비슷하면 서로의 약점을 보완하지 못하고 자극·성장 부족 위험 있어요. 1년차에 \"이게 사랑인가 우정인가\" 헷갈리는 시기 한 번 옴. 의도적으로 새로운 경험·도전 도입하면 평생 가는 안정형 관계.` :
    score >= 70 ? `${a} ↔ ${b}는 일부 축이 같아 편안한 부분 있지만, 다른 축에서 \"왜 저렇게 행동하지?\" 의문 자주 들 수 있는 조합. 자연스럽게 가깝지는 않아도 노력으로 만들어가는 관계. 3개월·1년·3년 시점에 각각 \"우리 잘 가고 있나?\" 점검 권장.` :
    score >= 55 ? `${a} ↔ ${b}는 끌림과 갈등이 공존하는 자극형 조합. \"왜 이 사람한테 끌리는데 또 답답해?\" 패턴 반복. 다름을 \"결함\"이 아닌 \"성장 기회\"로 받는 멘탈 강한 사람한테는 평생 인생 파트너 가능. 약한 사람한테는 6개월 못 가는 관계.` :
    score >= 45 ? `${a} ↔ ${b}는 정반대에 가까운 조합. 처음엔 강한 호기심·끌림 → 사귀고 1~2개월 후 \"왜 모든 게 다르지?\" 충격. 같은 가치관·결정 방식 거의 없어 매일이 협상. 의식적 노력 없이는 1년 안에 깨질 가능성 ↑. 노력하면 가장 자극적인 관계.` :
    `${a} ↔ ${b}는 한국 커뮤니티에서 \"환장의 조합\"으로 자주 언급되는 매치. 둘 다 서로 \"이해 안 됨\" 디폴트. 처음 끌림으로 만난 후 본인 친구·가족이 \"왜 저런 사람이랑?\" 의문 빈도 ↑. 평생 가려면 둘 다 자기 자신을 깊이 이해 + 상대 다름을 \"공격\"으로 안 받는 멘탈 + 정기적 외부 상담 같은 수준의 노력 필요.`;

  const axes = [eIAnalysis(a, b), nSAnalysis(a, b), tFAnalysis(a, b), jPAnalysis(a, b)];

  const isNF = a[1] === "N" && a[2] === "F";
  const bisNF = b[1] === "N" && b[2] === "F";
  const isNT = a[1] === "N" && a[2] === "T";
  const bisNT = b[1] === "N" && b[2] === "T";

  const romance = Math.min(100, Math.max(20, score + (isNF && bisNF ? 5 : 0) + (matches >= 3 ? 3 : 0) - (matches === 0 ? 8 : 0)));
  const work = Math.min(100, Math.max(20, 55 + (sameN ? 15 : 0) + (sameT ? 10 : 0) + ((isNT && bisNT) ? 12 : 0) + (sameJ ? 8 : 0)));
  const friendship = Math.min(100, Math.max(20, 60 + (matches >= 2 ? 18 : 0) + (sameE ? 6 : 0) + (sameN ? 8 : 0)));

  return {
    score, type, longDescription, axes,
    loveExpression: { yours: loveExpressionFor(a), theirs: loveExpressionFor(b) },
    dateStyle: dateStyleFor(a, b),
    conflictPattern: conflictPatternFor(a, b),
    triggers: { yours: triggerFor(a), theirs: triggerFor(b) },
    longTermTip: longTermTipFor(matches, score),
    romance, work, friendship,
    firstImpression: firstImpressionFor(a, b),
    katokVibe: katokVibeFor(a, b),
    forbiddenWords: { yours: forbiddenWordsFor(a), theirs: forbiddenWordsFor(b) },
    breakupSign: breakupSignFor(a, b),
  };
}

export const MBTI_TYPES = TYPES;
