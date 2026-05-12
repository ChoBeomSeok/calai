export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "건강" | "금융" | "부동산" | "자동차" | "세금" | "일상" | "개발자" | "여행" | "라이프" | "문서" | "이미지";
  icon: string;
};

export const tools: Tool[] = [
  // 건강
  { slug: "/bmi", title: "BMI 계산기", shortTitle: "BMI", description: "키·체중으로 비만도 즉시 계산. 한국·WHO 기준 비교.", category: "건강", icon: "🧍" },
  { slug: "/calorie", title: "칼로리 계산기 (BMR·TDEE)", shortTitle: "칼로리", description: "기초대사량·일일 소모 칼로리 + 다이어트·유지·벌크업 권장.", category: "건강", icon: "🔥" },
  { slug: "/standard-weight", title: "표준 체중 계산기", shortTitle: "표준 체중", description: "키·성별 기준 표준 체중 + 비만도 (브로카·로러 공식).", category: "건강", icon: "⚖️" },
  { slug: "/pregnancy", title: "임신 주차·출산 예정일", shortTitle: "임신 주차", description: "마지막 생리일 → 임신 주차·출산 예정일·태교 시기 자동.", category: "건강", icon: "🤰" },
  { slug: "/ovulation", title: "배란일 계산기", shortTitle: "배란일", description: "마지막 생리일·주기로 배란일·가임기 자동 계산.", category: "건강", icon: "🌸" },
  { slug: "/alcohol", title: "음주 알코올 분해 시간", shortTitle: "알코올 분해", description: "성별·체중·음주량으로 운전 가능 시간 추정.", category: "건강", icon: "🍺" },
  { slug: "/one-rm", title: "1RM 계산기", shortTitle: "1RM", description: "들어올린 무게·횟수로 1회 최대 중량(1RM) 추정.", category: "건강", icon: "🏋️" },
  { slug: "/marathon-pace", title: "마라톤 페이스 계산기", shortTitle: "마라톤 페이스", description: "5km·10km·하프·풀 마라톤 목표 시간 → 페이스 (km당 분).", category: "건강", icon: "🏃" },
  { slug: "/mountain-time", title: "등산 시간 계산기", shortTitle: "등산 시간", description: "거리·고도로 예상 등산 시간 (Naismith·Tobler 공식).", category: "건강", icon: "⛰️" },
  { slug: "/water-intake", title: "수분 섭취량 계산기", shortTitle: "수분 섭취", description: "체중·활동량으로 일일 수분 권장량 자동.", category: "건강", icon: "💧" },
  { slug: "/sleep", title: "수면 시간 계산기", shortTitle: "수면 시간", description: "기상 시간 → 90분 사이클 기반 취침 시간 추천.", category: "건강", icon: "😴" },
  { slug: "/child-height", title: "어린이 키 예측", shortTitle: "키 예측", description: "부모 키·성별로 자녀 예상 성인 키 (Tanner 공식).", category: "건강", icon: "👶" },
  { slug: "/heart-rate", title: "심박수 운동 강도", shortTitle: "심박수 강도", description: "나이로 최대·운동 강도 50~85% 심박수 자동.", category: "건강", icon: "❤️" },

  // 금융
  { slug: "/loan", title: "대출 이자 계산기", shortTitle: "대출 이자", description: "원리금 균등·원금 균등·만기 일시 3가지 방식.", category: "금융", icon: "💰" },
  { slug: "/savings", title: "적금 만기 계산기", shortTitle: "적금 만기", description: "월 적립액·금리·기간으로 만기 수령액·세후 실수령.", category: "금융", icon: "🏦" },
  { slug: "/compound", title: "복리 계산기", shortTitle: "복리", description: "원금·이율·기간·복리 주기로 미래 가치.", category: "금융", icon: "📈" },
  { slug: "/salary", title: "연봉 실수령액 계산기", shortTitle: "연봉 실수령", description: "연봉 → 4대보험·소득세 차감 후 월 실수령.", category: "금융", icon: "💵" },
  { slug: "/exchange", title: "환율 변환기", shortTitle: "환율 변환", description: "USD·JPY·EUR·CNY·원 즉시 변환.", category: "금융", icon: "💱" },
  { slug: "/installment", title: "신용카드 할부 계산기", shortTitle: "카드 할부", description: "할부 원금·개월·수수료율로 월 청구액·총 수수료.", category: "금융", icon: "💳" },
  { slug: "/stock-average", title: "주식 평단가 계산기", shortTitle: "주식 평단가", description: "기존 보유 + 추가 매수로 평균 단가.", category: "금융", icon: "📊" },
  { slug: "/coin-average", title: "가상화폐 평단가", shortTitle: "코인 평단가", description: "기존 코인 + 추가 매수로 평균 매수가.", category: "금융", icon: "🪙" },
  { slug: "/coin-pl", title: "코인 손익 계산기", shortTitle: "코인 손익", description: "매수가·매도가·수량으로 손익률·실현 수익 계산.", category: "금융", icon: "💹" },
  { slug: "/freelancer-tax", title: "프리랜서 3.3% 원천징수", shortTitle: "3.3% 원천", description: "프리랜서 수익 → 원천징수 3.3% + 종합소득세 추정.", category: "금융", icon: "🧑‍💻" },
  { slug: "/job-change", title: "이직 손익 계산기", shortTitle: "이직 손익", description: "현재 vs 새 직장 연봉·복지·통근비 종합 비교.", category: "금융", icon: "💼" },
  { slug: "/inflation", title: "인플레이션 환산", shortTitle: "인플레이션", description: "10년 전 100만원 = 지금 얼마 / 미래 가치 추정.", category: "금융", icon: "📉" },
  { slug: "/remit-fee", title: "외환 송금 수수료", shortTitle: "송금 수수료", description: "은행·송금 서비스별 수수료 + 환율 우대 비교.", category: "금융", icon: "💸" },
  { slug: "/rule-of-72", title: "72의 법칙 계산기", shortTitle: "72의 법칙", description: "현재 금리에서 자산이 2배 되는 기간 즉시 계산.", category: "금융", icon: "✖️" },

  // 부동산
  { slug: "/capital-gains", title: "양도소득세 계산기", shortTitle: "양도세", description: "1주택·다주택 양도세 + 보유·거주별 공제.", category: "부동산", icon: "🏠" },
  { slug: "/acquisition-tax", title: "취득세 계산기", shortTitle: "취득세", description: "매매가·전용면적·1주택/다주택 기준 취득세.", category: "부동산", icon: "🔑" },
  { slug: "/agent-fee", title: "중개수수료 계산기", shortTitle: "중개수수료", description: "매매·전세·월세 거래액별 법정 한도.", category: "부동산", icon: "🤝" },
  { slug: "/property-tax", title: "재산세 계산기", shortTitle: "재산세", description: "주택 공시가격으로 재산세 + 도시지역분 + 지방교육세.", category: "부동산", icon: "📋" },
  { slug: "/jeonse-monthly", title: "전월세 전환 계산기", shortTitle: "전월세 전환", description: "전세보증금 ↔ 월세 보증금/월세 변환.", category: "부동산", icon: "🏘️" },
  { slug: "/rental-yield", title: "임대수익률 계산기", shortTitle: "임대수익률", description: "매매가·보증금·월세로 연 임대수익률.", category: "부동산", icon: "📐" },
  { slug: "/cheongyak-score", title: "청약 가점 계산기", shortTitle: "청약 가점", description: "무주택·부양가족·청약통장 기간으로 청약 가점 자동.", category: "부동산", icon: "🎯" },
  { slug: "/ltv-dti", title: "LTV·DTI 계산기", shortTitle: "LTV·DTI", description: "주택가·소득·기존 대출로 LTV·DTI·DSR 한도.", category: "부동산", icon: "📊" },

  // 자동차
  { slug: "/car-tax", title: "자동차세 계산기", shortTitle: "자동차세", description: "배기량·연식별 자동차세 + 차령 경감.", category: "자동차", icon: "🚗" },
  { slug: "/fuel-cost", title: "주유비 계산기", shortTitle: "주유비", description: "주행거리·연비·기름값으로 총 주유비.", category: "자동차", icon: "⛽" },
  { slug: "/car-loan", title: "자동차 할부 계산기", shortTitle: "자동차 할부", description: "차량 가격·계약금·할부 기간으로 월 할부금.", category: "자동차", icon: "🚙" },
  { slug: "/parking-fee", title: "주차 요금 계산기", shortTitle: "주차 요금", description: "기본 요금·추가 시간·할인으로 주차비 자동.", category: "자동차", icon: "🅿️" },
  { slug: "/ev-charge", title: "전기차 충전 비용", shortTitle: "전기차 충전", description: "주행거리·전비·요금제로 충전 비용 + 주유비 비교.", category: "자동차", icon: "🔌" },
  { slug: "/toll-fee", title: "고속도로 톨비 계산", shortTitle: "고속도로 톨비", description: "출발·도착 IC + 차종으로 통행료 추정 (서울→부산 등).", category: "자동차", icon: "🛣️" },

  // 세금
  { slug: "/income-tax", title: "종합소득세 계산기", shortTitle: "종합소득세", description: "사업·근로·이자 등 종합소득 누진세.", category: "세금", icon: "🧾" },
  { slug: "/vat", title: "부가가치세 계산기", shortTitle: "부가세", description: "공급가액 ↔ 부가세 ↔ 합계금액 즉시 변환 (10%).", category: "세금", icon: "🧮" },
  { slug: "/inheritance-tax", title: "상속세 계산기", shortTitle: "상속세", description: "상속재산·상속인 수로 상속세 누진 계산.", category: "세금", icon: "📜" },
  { slug: "/gift-tax", title: "증여세 계산기", shortTitle: "증여세", description: "증여재산·관계별 공제로 증여세 누진.", category: "세금", icon: "🎁" },
  { slug: "/severance", title: "퇴직금 계산기", shortTitle: "퇴직금", description: "재직기간·평균임금으로 퇴직금 즉시.", category: "세금", icon: "💼" },
  { slug: "/comprehensive-property-tax", title: "종합부동산세 계산기", shortTitle: "종부세", description: "공시가격·1주택/다주택으로 종부세 누진 계산.", category: "세금", icon: "🏛️" },

  // 일상
  { slug: "/pyeong", title: "평수·㎡ 변환기", shortTitle: "평수 변환", description: "㎡ ↔ 평 ↔ 헥타르 ↔ ft² 즉시 변환.", category: "일상", icon: "📏" },
  { slug: "/age", title: "만 나이 계산기", shortTitle: "만 나이", description: "생년월일로 만 나이·연 나이·다음 생일 D-Day.", category: "일상", icon: "🎂" },
  { slug: "/dday", title: "D-Day 계산기", shortTitle: "D-Day", description: "두 날짜 차이 + N일 후·전 날짜 계산.", category: "일상", icon: "📅" },
  { slug: "/percent", title: "백분율 계산기", shortTitle: "백분율", description: "% 비율·증감율·전체값에서 % 추출.", category: "일상", icon: "💯" },
  { slug: "/discount", title: "할인율 계산기", shortTitle: "할인율", description: "정가·할인율·할인가 양방향 계산.", category: "일상", icon: "🏷️" },
  { slug: "/tip", title: "팁·N빵 계산기", shortTitle: "팁·N빵", description: "총액 + 봉사료 + 인원으로 1인당 분담.", category: "일상", icon: "🍽️" },
  { slug: "/gpa", title: "학점 (GPA) 계산기", shortTitle: "학점 GPA", description: "과목·학점·등급으로 누적 평점 4.5/4.3/100점.", category: "일상", icon: "🎓" },
  { slug: "/electricity", title: "전기요금 계산기", shortTitle: "전기요금", description: "월 사용량 → 주택용 누진제 자동 계산.", category: "일상", icon: "💡" },
  { slug: "/lunar", title: "음력 ↔ 양력 변환", shortTitle: "음력 양력", description: "양력 → 음력, 음력 → 양력 + 한국 띠·간지.", category: "일상", icon: "🌙" },
  { slug: "/zodiac", title: "띠·별자리 계산기", shortTitle: "띠·별자리", description: "생년월일로 띠 + 12별자리 + 혈액형 궁합.", category: "일상", icon: "✨" },
  { slug: "/unit", title: "단위 변환기", shortTitle: "단위 변환", description: "길이·무게·온도·부피·속도 모든 단위 변환.", category: "일상", icon: "📐" },
  { slug: "/timezone", title: "세계 시간 변환기", shortTitle: "세계 시간", description: "한국 시간 ↔ 뉴욕·런던·도쿄 등 주요 도시 시차.", category: "일상", icon: "🕐" },
  { slug: "/lotto", title: "로또 번호 생성기", shortTitle: "로또 번호", description: "로또 6/45 자동 번호 생성 + 보너스 번호 + 통계 기반 패턴.", category: "일상", icon: "🎰" },
  { slug: "/pomodoro", title: "포모도로 타이머", shortTitle: "포모도로", description: "25분 작업 + 5분 휴식 자동 반복. 집중력 향상 기법.", category: "일상", icon: "🍅" },
  { slug: "/countdown", title: "카운트다운 타이머", shortTitle: "카운트다운", description: "원하는 시간 설정 → 0초 카운트다운 + 알림.", category: "일상", icon: "⏰" },
  { slug: "/unit-price", title: "단가 비교 (g당)", shortTitle: "단가 비교", description: "여러 상품 가격·용량 → g당·100g당·ml당 단가 비교.", category: "일상", icon: "🛒" },
  { slug: "/annual-leave", title: "휴가 일수 계산", shortTitle: "휴가 일수", description: "입사일 → 근로기준법 기준 연차 자동 계산.", category: "일상", icon: "🏖️" },

  // 개발자
  { slug: "/password", title: "비밀번호 생성기", shortTitle: "비밀번호", description: "길이·문자 종류 선택해 안전한 비밀번호 생성.", category: "개발자", icon: "🔐" },
  { slug: "/color", title: "색상 변환기", shortTitle: "색상 변환", description: "HEX ↔ RGB ↔ HSL 동시 변환 + 미리보기.", category: "개발자", icon: "🎨" },
  { slug: "/uuid", title: "UUID 생성기", shortTitle: "UUID", description: "UUID v4 즉시 생성 (1~100개 일괄).", category: "개발자", icon: "🆔" },
  { slug: "/json-format", title: "JSON 포매터", shortTitle: "JSON 포매터", description: "JSON 문자열 정렬·압축·검증.", category: "개발자", icon: "📄" },
  { slug: "/base64", title: "Base64 인코딩·디코딩", shortTitle: "Base64", description: "문자열 ↔ Base64 양방향 변환 (UTF-8 한글 지원).", category: "개발자", icon: "🔤" },
  { slug: "/url-encode", title: "URL 인코딩·디코딩", shortTitle: "URL 인코딩", description: "URL 특수문자·한글 인코딩·디코딩.", category: "개발자", icon: "🔗" },
  { slug: "/jwt-decode", title: "JWT 디코더", shortTitle: "JWT 디코더", description: "JWT 토큰의 header·payload·signature 즉시 분석.", category: "개발자", icon: "🎫" },
  { slug: "/regex-test", title: "정규식 테스터", shortTitle: "정규식", description: "정규식 패턴 + 테스트 문자열로 매칭 결과 즉시.", category: "개발자", icon: "🔍" },
  { slug: "/ai-token", title: "AI 토큰 비용 계산기", shortTitle: "AI 토큰", description: "OpenAI·Claude·Gemini 입출력 토큰별 API 비용 즉시 비교.", category: "개발자", icon: "🤖" },
  { slug: "/qr-code", title: "QR 코드 생성기", shortTitle: "QR 코드", description: "URL·텍스트 → QR 코드 즉시 생성, 다운로드 가능.", category: "개발자", icon: "📱" },
  { slug: "/color-palette", title: "컬러 팔레트 생성기", shortTitle: "컬러 팔레트", description: "기준 색에서 5색 조화 (보색·유사·삼각·사각) 자동 생성.", category: "개발자", icon: "🎨" },

  // 라이프
  { slug: "/wedding-cost", title: "결혼 비용 계산기", shortTitle: "결혼 비용", description: "예식·예물·신혼여행·집 셋업 항목별 한국 평균 합산.", category: "라이프", icon: "💒" },
  { slug: "/child-cost", title: "자녀 양육비 계산", shortTitle: "자녀 양육비", description: "0~18세 누적 양육비 + 사교육비 시뮬레이션.", category: "라이프", icon: "👨‍👩‍👧" },
  { slug: "/compatibility", title: "궁합 계산기", shortTitle: "궁합", description: "두 사람 생년월일 → 동·서양 궁합 자동 분석.", category: "라이프", icon: "💕" },
  { slug: "/mbti-compatibility", title: "MBTI 궁합", shortTitle: "MBTI 궁합", description: "두 MBTI → 16×16 궁합 매트릭스 + 관계 팁.", category: "라이프", icon: "🧠" },
  { slug: "/carbon-footprint", title: "탄소 발자국 계산기", shortTitle: "탄소 발자국", description: "운전·여행·식단·전기로 일·연 CO₂ 배출량 추정.", category: "라이프", icon: "🌱" },
  { slug: "/korea-rank", title: "한국에서 몇 번째? 진단", shortTitle: "한국 순위", description: "생년월일·이름·키로 같은 생일 동기·키 분위·성씨 순위·누적 출생 순번 6가지 한 페이지.", category: "라이프", icon: "🇰🇷" },

  // 문서 (PDF·이미지 변환 — 모두 무료·브라우저 내 처리)
  { slug: "/pdf-merge", title: "PDF 합치기 (무료)", shortTitle: "PDF 합치기", description: "여러 PDF 파일을 하나로 무료 결합. 가입·로그인·워터마크 없음. 브라우저 내 처리로 안전.", category: "문서", icon: "📑" },
  { slug: "/pdf-split", title: "PDF 분할 (무료)", shortTitle: "PDF 분할", description: "PDF를 페이지 단위로 무료 분할. 페이지 범위 지정 가능. 브라우저 내 처리.", category: "문서", icon: "✂️" },
  { slug: "/pdf-compress", title: "PDF 용량 줄이기 (무료)", shortTitle: "PDF 압축", description: "PDF 파일 용량 무료 압축. 이메일 첨부·업로드 한도 회피.", category: "문서", icon: "🗜️" },
  { slug: "/pdf-extract", title: "PDF 페이지 추출 (무료)", shortTitle: "PDF 추출", description: "PDF에서 원하는 페이지만 무료 추출해 새 파일 생성.", category: "문서", icon: "📄" },
  { slug: "/pdf-rotate", title: "PDF 회전 (무료)", shortTitle: "PDF 회전", description: "PDF 페이지 90·180·270도 회전. 가로·세로 정렬 무료.", category: "문서", icon: "🔄" },
  { slug: "/pdf-to-image", title: "PDF → 이미지 (무료)", shortTitle: "PDF→JPG", description: "PDF 페이지를 JPG·PNG 이미지로 무료 변환. 화질 선택 가능.", category: "문서", icon: "🖼️" },
  { slug: "/image-to-pdf", title: "이미지 → PDF (무료)", shortTitle: "JPG→PDF", description: "JPG·PNG 여러 장을 하나의 PDF로 무료 변환. 순서 조정 가능.", category: "문서", icon: "📷" },
  { slug: "/pdf-watermark", title: "PDF 워터마크 (무료)", shortTitle: "PDF 워터마크", description: "PDF에 텍스트 워터마크를 무료로 추가. 위치·투명도 조정.", category: "문서", icon: "💧" },
  { slug: "/word-count", title: "글자수 세기 (무료)", shortTitle: "글자수 세기", description: "공백 포함·제외·바이트·원고지 매수·자소서·SNS 한도 실시간 표시. 자소서·논문 필수.", category: "문서", icon: "🔢" },

  // 이미지
  { slug: "/id-photo", title: "증명사진 만들기 (무료)", shortTitle: "증명사진", description: "여권·이력서·민증·비자 한국 9종 규격 자동 크롭. 배경색 변경·DPI 300 인쇄 가능.", category: "이미지", icon: "📸" },
  { slug: "/image-compress", title: "이미지 압축 (무료)", shortTitle: "이미지 압축", description: "JPG·PNG·WebP 용량 무료 압축. 일괄 처리·품질 조정·원본 비교.", category: "이미지", icon: "🗜️" },

  // 생활·행정 (일상 카테고리에 추가)
  { slug: "/unemployment-benefit", title: "실업급여 계산기", shortTitle: "실업급여", description: "평균임금·가입기간으로 1일 수급액·총 지급액·기간 자동 계산 (2026 고용보험법 기준).", category: "금융", icon: "💼" },

  // 부동산 추가
  { slug: "/jeonse-risk", title: "전세 사기 위험도 체크", shortTitle: "전세 위험도", description: "보증금·매매가·근저당 입력 → 깡통전세 위험도 종합 진단 (5가지 지표).", category: "부동산", icon: "🚨" },

  // 개발자 확장
  { slug: "/markdown", title: "마크다운 미리보기·변환", shortTitle: "마크다운", description: "Markdown → HTML 실시간 미리보기 + HTML·PDF 다운로드. GFM 지원.", category: "개발자", icon: "📝" },
  { slug: "/timestamp", title: "Unix 타임스탬프 변환", shortTitle: "타임스탬프", description: "Unix timestamp ↔ 9가지 날짜 포맷. KST·UTC·ISO·RFC·밀리초·나노초 동시 표시.", category: "개발자", icon: "⏱️" },
  { slug: "/cron", title: "Cron 표현식 해석기", shortTitle: "Cron", description: "Cron 표현식(0 9 * * 1) → 한국어 해석 + 다음 5회 실행 시간 미리보기.", category: "개발자", icon: "🕐" },
  { slug: "/sql-format", title: "SQL 포매터", shortTitle: "SQL 포매터", description: "압축된 SQL 쿼리 자동 들여쓰기·키워드 대문자 변환. 8개 dialect 지원.", category: "개발자", icon: "🗄️" },
  { slug: "/csv-json", title: "CSV ↔ JSON 변환기", shortTitle: "CSV JSON", description: "CSV ↔ JSON 양방향 무료 변환. 헤더 자동 인식·구분자 감지·숫자 자동 타입·미리보기 테이블.", category: "개발자", icon: "🔄" },
  { slug: "/hash", title: "해시 생성기 (MD5·SHA·HMAC)", shortTitle: "해시 생성", description: "텍스트·파일 → MD5·SHA-1·SHA-256·SHA-384·SHA-512 동시 생성 + HMAC 서명. 파일 무결성·체크섬용.", category: "개발자", icon: "🔑" },
  { slug: "/strip-metadata", title: "메타데이터 제거 (PDF·이미지)", shortTitle: "메타 제거", description: "PDF·JPG·PNG·WebP 작성자·GPS·카메라·수정 이력 완전 제거. 처리 전후 비교 + 재검증.", category: "문서", icon: "🧹" },
  { slug: "/pdf-sign", title: "PDF 손글씨 서명 (무료)", shortTitle: "PDF 서명", description: "PDF에 손글씨 서명 추가. 마우스·터치·펜 압력 인식, 드래그·리사이즈로 정확한 위치 배치.", category: "문서", icon: "✍️" },
];
