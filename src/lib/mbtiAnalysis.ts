// MBTI 4축 깊이 분석 라이브러리

const TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

const BEST_PAIRS: Record<string, string[]> = {
  "INTJ": ["ENFP", "ENTP"], "INTP": ["ENTJ", "ESTJ"], "ENTJ": ["INTP", "INFP"], "ENTP": ["INFJ", "INTJ"],
  "INFJ": ["ENFP", "ENTP"], "INFP": ["ENFJ", "ENTJ"], "ENFJ": ["INFP", "ISFP"], "ENFP": ["INTJ", "INFJ"],
  "ISTJ": ["ESFP", "ESTP"], "ISFJ": ["ESFP", "ESTP"], "ESTJ": ["ISFP", "ISTP"], "ESFJ": ["ISFP", "ISTP"],
  "ISTP": ["ESTJ", "ESFJ"], "ISFP": ["ENFJ", "ESFJ"], "ESTP": ["ISTJ", "ISFJ"], "ESFP": ["ISTJ", "ISFJ"],
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
};

function eIAnalysis(a: string, b: string): AxisAnalysis {
  const sameE = a[0] === "E";
  if (a[0] === b[0]) {
    return {
      axis: "외향 ↔ 내향 (E/I)",
      matched: true,
      title: sameE ? "둘 다 외향형 (E·E)" : "둘 다 내향형 (I·I)",
      detail: sameE
        ? "사교 활동·여행·이벤트를 함께 즐기고, 에너지 충전 방식이 같습니다. 사람 많은 자리에서 둘 다 활기를 얻으니 큰 모임·파티·새로운 만남이 자연스러운 데이트가 됩니다."
        : "함께 있어도 침묵이 편안하고, 조용한 카페·산책·홈 데이트가 즐겁습니다. 둘 다 깊은 1:1 대화를 선호해 빠르게 친밀해질 수 있습니다.",
      example: sameE
        ? "다만 둘 다 외향이라 깊은 단둘 시간이 부족할 수 있어요. 정기적으로 \"오늘은 우리 둘만\" 시간을 의식적으로 확보 권장."
        : "다만 사회적 활동·새 인간관계 확장이 부족할 수 있어요. 한 달에 한두 번은 의식적으로 외출·모임 계획을 잡는 게 관계에 활력.",
    };
  }
  return {
    axis: "외향 ↔ 내향 (E/I)",
    matched: false,
    title: "외향(E) ↔ 내향(I) — 다름",
    detail:
      "에너지 충전 방식이 정반대입니다. E는 사람을 만나며 충전, I는 혼자 있으며 충전합니다. 같은 양의 사교 활동 후 E는 신나고, I는 진이 빠집니다. 이 차이를 \"성격 결함\"이 아닌 \"배터리 종류 차이\" 로 인식하는 게 시작점입니다.",
    example:
      "💡 E는 I의 \"오늘은 좀 쉬고 싶어\"를 거부로 받아들이지 말기. I는 E의 사교 욕구를 인정하고 \"너 갔다 와, 나는 집에서 쉴게\" 권장. 사교 일정의 50:50 균형 보다 각자 원하는 만큼이 더 건강.",
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
        ? "미래·꿈·이론·\"만약에\" 같은 추상 대화를 즐깁니다. 깊이 있는 토론·아이디어 교환이 자연스럽고, 영화·책의 주제·의미를 함께 분석하는 즐거움이 큽니다."
        : "현재·실용·구체 가치관이 일치합니다. 일상 결정이 빠르고, \"오늘 뭐 먹지·어디 갈지\" 같은 실용적 합의가 잘 됩니다. 둘 다 사실에 기반한 대화를 선호.",
      example: sameN
        ? "다만 둘 다 일상 디테일·청구서·정리를 놓치기 쉽습니다. 한 명은 가계부·일정 관리 시스템 담당 권장. 또 둘 다 \"가능성\" 에 끌려 새로운 시도가 너무 많아질 수 있어요."
        : "다만 새로운 시도·장기 비전 토론이 부족할 수 있습니다. 의식적으로 \"5년 후 우리 어떻게 살고 싶어?\" 같은 큰 그림 대화를 가끔 시도하면 관계가 더 깊어져요.",
    };
  }
  return {
    axis: "직관 ↔ 감각 (N/S) — 가장 큰 차이",
    matched: false,
    title: "직관(N) ↔ 감각(S) — 정보 처리 방식 정반대",
    detail:
      "MBTI 4축 중 가장 갈등이 큰 축입니다. N은 추상·가능성·미래·의미를 보고, S는 구체·사실·현재·디테일을 봅니다. 같은 영화를 보고 N은 \"주제가 뭐였어?\" 라 묻고, S는 \"근데 그 사람이 결국 어떻게 됐어?\" 라 묻습니다. 같은 데이터를 보고 정반대 결론에 도달하기도 해요.",
    example:
      "💡 N은 추상 표현 후 \"예를 들면…\" 으로 구체 예시 들어 설명. S는 N의 \"왠지 그럴 것 같아\" 같은 직관을 비논리라 비웃지 말고 끝까지 듣기. 일상 디테일은 S가, 미래 계획은 N이 담당하는 분담이 가장 효율적.",
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
        ? "갈등 시 논리적 분석·객관적 결정이 빠릅니다. 감정에 휘둘리지 않고 \"뭐가 문제이고 어떻게 해결할지\" 에 집중하니 효율적이에요."
        : "서로 공감을 잘하고 분위기·관계를 우선합니다. 감정 표현이 자연스러워 깊은 정서적 친밀감이 빠르게 형성되어요.",
      example: sameT
        ? "다만 감정 케어·공감 표현이 부족할 수 있어요. 의식적으로 \"오늘 기분 어땠어?\" 묻고, 결론 내기 전 상대 마음에 공감 한 번 표현하는 연습 권장."
        : "다만 중요한 결정에서 정에 휘둘릴 수 있어요. 가족·친구 관계로 인한 결정 시 \"감정 빼고 사실만 보면 어떨까?\" 한 번 묻기. 큰 금융·진로 결정은 객관적 검토 같이.",
    };
  }
  return {
    axis: "사고 ↔ 감정 (T/F)",
    matched: false,
    title: "사고(T) ↔ 감정(F) — 결정 기준 정반대",
    detail:
      "T는 옳고 그름·논리·결과로 결정하고, F는 마음·관계·조화로 결정합니다. 같은 갈등 상황에서 T는 \"누가 잘못했나\" 를 보고, F는 \"누구의 마음이 다쳤나\" 를 봅니다. 갈등 해결 시 가장 자주 부딪히는 영역.",
    example:
      "💡 T는 결론·해결책 제시 전에 \"네 마음은 어땠어?\" 한 번 묻기. F의 감정 토로를 듣기만 하는 것 자체가 \"해결\" 이라는 점 인정. F는 T의 직설·논리를 \"공격\" 으로 받지 말고, T 입장에서 그게 \"애정의 표현\" 임을 이해.",
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
        ? "계획·약속·정리 가치관이 동일합니다. 데이트·여행·재정 관리 모두 안정적·예측 가능. 약속 시간 정확하고 일정 관리 잘 맞습니다."
        : "즉흥·자유·여유를 함께 추구합니다. 서로 \"빨리 결정해\" 압박 안 하니 편안하고, 즉흥 여행·갑작스러운 약속도 즐겁게 받아들이는 관계.",
      example: sameJ
        ? "다만 새로운 시도·즉흥 활동이 부족할 수 있어요. 한 달에 한 번 \"이번 주말은 계획 없이!\" 같은 의도적 즉흥성 도입 권장."
        : "다만 중요한 약속·마감·세금 신고 같은 게 자주 늦어질 수 있어요. 한 명은 \"중요 일정 캘린더\" 담당하고, 둘이 약속한 마감만큼은 지키기.",
    };
  }
  return {
    axis: "판단 ↔ 인식 (J/P)",
    matched: false,
    title: "판단(J) ↔ 인식(P) — 라이프 스타일 차이",
    detail:
      "J는 미리 계획하고 결정해 안정을 얻고, P는 가능성을 열어두고 여유롭게 결정해 자유를 얻습니다. 데이트·여행·일상 모든 영역에서 부딪힙니다. J는 1주일 전 \"토요일 저녁 7시 OO식당\" 예약, P는 당일 오후 \"뭐 먹지?\" 시작.",
    example:
      "💡 J는 P의 \"천천히 정해도 돼\" 를 무계획·무책임이 아닌 \"열린 가능성\" 으로 받아들이기. P는 중요한 약속(여행 항공권·결혼식·마감)만큼은 J의 계획에 따라주기. 일상의 즉흥성은 P, 큰 일정은 J가 주도하는 분담 권장.",
  };
}

function loveExpressionFor(type: string): string {
  const t = type[2], j = type[3], e = type[0];
  if (t === "T" && j === "J") return `행동·해결·실용 선물로 표현. \"널 위해 이걸 했어\" / \"문제 해결해줄게\" 가 사랑의 언어. 말로 \"사랑해\" 보단 챙겨주는 행동`;
  if (t === "T" && j === "P") return `함께 즐길 수 있는 새 경험·모험으로 표현. \"이거 같이 해보자\" / 재미있는 발견 공유. 진지한 감정 표현은 어색해함`;
  if (t === "F" && j === "J") return `세심한 챙김·기념일·디테일 기억으로 표현. 작은 메시지·기프트·사랑 확인이 중요. 정기적인 \"사랑해\" 표현이 자연스러움`;
  if (t === "F" && j === "P") return `즉흥적 사랑 표현·로맨틱 제스처. 갑작스러운 선물·편지·이벤트. 분위기·감정 표현이 풍부`;
  if (e === "E") return `함께 사람들 앞에 자랑·SNS 공유로 표현. 친구·가족에게 \"우리 OO\" 자랑이 사랑의 언어`;
  return `1:1 깊은 대화·조용한 시간·작은 주의로 표현`;
}

function dateStyleFor(a: string, b: string): string {
  const isNF1 = a[1] === "N" && a[2] === "F", isNF2 = b[1] === "N" && b[2] === "F";
  const isNT1 = a[1] === "N" && a[2] === "T", isNT2 = b[1] === "N" && b[2] === "T";
  const isSJ1 = a[1] === "S" && a[3] === "J", isSJ2 = b[1] === "S" && b[3] === "J";
  const isSP1 = a[1] === "S" && a[3] === "P", isSP2 = b[1] === "S" && b[3] === "P";

  if (isNF1 && isNF2) return "💕 깊은 대화 + 예술·감성 — 미술관·콘서트·로맨틱 식당·여행 + 깊은 밤 인생 토크";
  if (isNT1 && isNT2) return "🧠 토론 + 새 경험 — 이색 카페·박물관·새로운 도시·지식 공유. \"이거 어떻게 작동하지?\" 같이 탐구";
  if (isSJ1 && isSJ2) return "🍽️ 안정적·계획적 — 미리 예약한 맛집·공연·연극·데이트 시간 정확히 지키기";
  if (isSP1 && isSP2) return "🎢 즉흥·액티비티 — 액티비티·스포츠·즉흥 여행·새로운 시도. \"오늘 뭐 할까?\" 가 즐거움";
  if ((isNF1 && isNT2) || (isNT1 && isNF2)) return "💬 깊이 있는 대화 + 지적 자극 — 둘 다 직관(N) — 미래·아이디어·인생 의미 토론 데이트";
  if ((isSJ1 && isSP2) || (isSP1 && isSJ2)) return "⚖️ 안정 + 즉흥 균형 — 한 명은 계획, 한 명은 즉흥 — 1주에 한 번씩 번갈아 데이트 주도";
  return "🎨 다양한 시도 — 서로 좋아하는 데이트를 번갈아 — 한 주는 액티비티, 한 주는 깊은 대화";
}

function conflictPatternFor(a: string, b: string): string {
  const sameT = a[2] === b[2];
  const sameF = a[2] === "F" && b[2] === "F";
  if (sameF) return "🌊 둘 다 감정형 — 서로 토로 → 공감 → 화해. 다만 사실 검토 부족할 수 있어 큰 결정은 한 번 더 객관적으로 검토 권장";
  if (sameT && a[2] === "T") return "📊 둘 다 사고형 — 빠른 논리적 토론 → 빠른 결론. 다만 감정 케어 부족 — 결론 후 \"마음은 괜찮아?\" 한 번 확인";
  return "⚡ T ↔ F — 가장 어려운 패턴. T는 사실·해결, F는 감정·관계 우선. T는 공감 먼저, F는 사실 인정 먼저 시도. 갈등 시 즉답보다 1시간 후 다시 대화 권장";
}

function triggerFor(type: string): string {
  const t = type[2], j = type[3], e = type[0], n = type[1];
  if (t === "T") return "비논리적 결정·감정에 휘둘리는 모습·반복되는 푸념";
  if (t === "F") return "차가운 직설·감정 무시·\"논리적으로 봐\" 같은 말";
  if (j === "J" && n === "S") return "마지막 순간 변경·계획 무시·정리 안 됨";
  if (j === "P") return "강제된 일정·세부 계획 강요·결정 압박";
  if (e === "E") return "장시간 침묵·혼자만의 시간 강요·소극적 반응";
  return "갑작스러운 사람들 만남·시끄러운 환경·강요된 사교";
}

function longTermTipFor(matches: number): string {
  if (matches === 4) return "🌟 거의 같은 유형 — 너무 편안해서 자극·성장 부족 가능. 의도적으로 새로운 경험·다른 관점 도입 권장";
  if (matches >= 3) return "✨ 가치관 일치 — 일상 결정 빠르고 안정적. 한쪽이 약한 영역(계획·감정 등)은 외부 도움(친구·전문가) 받기 권장";
  if (matches === 2) return "⚖️ 균형형 — 같은 부분과 다른 부분 적절. 다른 축은 \"성격 차이\" 가 아닌 \"역할 분담\" 으로 받아들이면 시너지 큼";
  if (matches === 1) return "🔄 보완형 — 한 축만 같음. 나머지 3축이 달라 끌림 ↑이지만 갈등 ↑. 매주 \"이번 주 우리 어땠어?\" 정기 점검 권장";
  return "🎢 정반대형 — 모든 축 다름. 끌림과 충돌이 공존하는 가장 자극적인 관계. 서로 다름을 \"매력\" 으로 인식 + 공통 취미 1~2개 만들기";
}

export function fullAnalyze(a: string, b: string): Analysis {
  const sameE = a[0] === b[0], sameN = a[1] === b[1], sameT = a[2] === b[2], sameJ = a[3] === b[3];
  const matches = [sameE, sameN, sameT, sameJ].filter(Boolean).length;

  let score = 60;
  let type = "보통 — 노력과 이해 필요";
  if (a === b) { score = 75; type = "유사형 — 편안하지만 자극 부족"; }
  else if (BEST_PAIRS[a]?.includes(b)) { score = 95; type = "최고 궁합 — 서로 보완하는 황금 조합"; }
  else if (matches === 0) { score = 65; type = "정반대형 — 끌림과 충돌 공존"; }
  else if (matches >= 2) { score = 80; type = "유사 가치관 — 안정적"; }

  const longDescription =
    score >= 90 ? `${a}와(과) ${b}는 MBTI 이론에서 가장 자주 언급되는 황금 조합 중 하나입니다. 한쪽이 약한 영역을 다른 쪽이 자연스럽게 채워주는 보완 관계로, 첫 만남부터 강한 끌림을 느끼는 경우가 많아요. 다만 \"끌림 = 영원한 행복\" 은 아니고, 4축 중 다른 부분에 대한 의식적인 이해와 노력이 장기 관계의 핵심입니다.` :
    score >= 75 ? `${a}와(과) ${b}는 비슷한 가치관·결정 방식을 가져 일상에서 큰 마찰 없이 잘 맞는 조합입니다. 다만 너무 비슷하면 서로의 약점을 보완하지 못하거나 자극·성장이 부족할 수 있어, 의도적으로 새로운 경험·다른 관점을 도입하는 노력이 장기 관계에 도움됩니다.` :
    score >= 65 ? `${a}와(과) ${b}는 MBTI 4축 중 일부가 정반대인 조합으로, 강한 끌림이 있지만 갈등도 빈번합니다. \"왜 저 사람은 저렇게 행동할까?\" 라는 답답함이 자주 들 수 있어요. 다름을 결함이 아닌 차이로 받아들이고, 갈등 시 한 박자 쉬어가는 습관이 관계 유지의 핵심입니다.` :
    `${a}와(과) ${b}는 평범한 조합으로, 자연스럽게 가까워지기보다는 의식적인 노력으로 관계를 깊게 만들어가는 유형입니다. 같은 부분에서 안정감을, 다른 부분에서 자극을 얻는 균형형 관계가 될 수 있어요.`;

  const axes = [eIAnalysis(a, b), nSAnalysis(a, b), tFAnalysis(a, b), jPAnalysis(a, b)];

  const isNF = a[1] === "N" && a[2] === "F";
  const bisNF = b[1] === "N" && b[2] === "F";
  const isNT = a[1] === "N" && a[2] === "T";
  const bisNT = b[1] === "N" && b[2] === "T";

  const romance = score + (isNF && bisNF ? 5 : 0) + (matches >= 3 ? 5 : 0) - (matches === 0 ? 10 : 0);
  const work = 60 + (sameN ? 15 : 0) + (sameT ? 10 : 0) + ((isNT && bisNT) ? 10 : 0);
  const friendship = 65 + (matches >= 2 ? 15 : 0) + (sameE ? 5 : 0);

  return {
    score, type, longDescription, axes,
    loveExpression: { yours: loveExpressionFor(a), theirs: loveExpressionFor(b) },
    dateStyle: dateStyleFor(a, b),
    conflictPattern: conflictPatternFor(a, b),
    triggers: { yours: triggerFor(a), theirs: triggerFor(b) },
    longTermTip: longTermTipFor(matches),
    romance: Math.min(100, Math.max(20, romance)),
    work: Math.min(100, Math.max(20, work)),
    friendship: Math.min(100, Math.max(20, friendship)),
  };
}

export const MBTI_TYPES = TYPES;
