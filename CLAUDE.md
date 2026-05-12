@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 이 프로젝트가 무엇인가

`calai.kr` — 가입·로그인 없이 브라우저에서 즉시 계산하는 한국어 도구·계산기 104개 모음 사이트. Next.js 16 + React 19 + Tailwind v4. 모든 계산은 클라이언트에서 수행되어 서버로 입력값이 전송되지 않는다 (예외: `/api/exchange`, `/api/coin` 시세 프록시).

## 자주 쓰는 명령

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm start        # 빌드 결과 실행
npm run lint     # ESLint (eslint-config-next)
```

## 절대 잊지 말 것 — Next.js 16 + React 19

`AGENTS.md`에 적혀있듯 **이 버전의 Next.js는 학습 데이터의 Next.js와 다르다**. API·관습·파일 구조가 변경되어 있을 수 있으므로, 새 패턴을 도입하기 전에 반드시 `node_modules/next/dist/docs/` 의 해당 가이드를 먼저 읽을 것. deprecation 경고는 무시하지 말 것. React 19도 마찬가지.

## 큰 그림 — 도구 추가가 어떻게 사이트 전체에 퍼지는가

도구 하나를 추가하려면 **두 곳을 동시에 손대야 한다**. 한쪽만 손대면 사이트 곳곳이 비일관 상태가 된다:

1. **`src/app/<slug>/page.tsx`** — `"use client"` 컴포넌트. `CalculatorLayout`으로 감싸고 안에 계산 UI 작성.
2. **`src/app/<slug>/layout.tsx`** — 페이지별 `Metadata` (OG, canonical, JSON-LD `WebApplication`).
3. **`src/lib/tools.ts`** — 도구 레지스트리. 여기에 `{ slug, title, shortTitle, description, category, icon }` 한 줄을 추가해야 다음이 동작:
   - 홈 검색 (`src/app/page.tsx`의 `matches`)
   - 사이트맵 (`src/app/sitemap.ts`)
   - `CalculatorLayout`의 breadcrumb / 관련 도구 / 카테고리 분류
   - `ToolGuide`의 슬러그 매칭

도구 디렉터리가 있어도 `tools.ts`에 등록 안 되어 있으면 사이트맵·검색·내비게이션에서 보이지 않는 "유령 페이지"가 된다.

선택적으로 `src/lib/toolGuides.ts`에 슬러그(앞의 `/` 제거)를 키로 `intro`/`formula`/`whenToUse`/`tips`/`faq`/`examples`/`mistakes`/`timeline`/`advanced` 가이드를 작성하면 `ToolGuide` 컴포넌트가 페이지 하단에 자동 렌더링되고, `faq`가 있으면 `FAQPage` JSON-LD가 함께 출력된다. 비워두면 `getCategoryFallback`가 카테고리 단위 기본 문구로 채운다.

## 페이지 공통 골격 (`CalculatorLayout`)

각 계산기 페이지는 `CalculatorLayout`으로 감싼다. 이것이 자동으로 처리:

- breadcrumb JSON-LD + 화면 표시
- 즐겨찾기 토글 / 최근 본 도구 추적 (`localStorage`: `calai-favorites`, `calai-recent` — 키 8개 제한)
- 공유 버튼 (Web Share API → clipboard fallback)
- 관련 도구 6개 (같은 카테고리 우선)
- `ToolGuide` 자동 렌더

→ 새 도구 page에서는 위 기능을 다시 구현하지 말고 `<CalculatorLayout title=... description=...>` 로만 감싼다.

## 라우트 구조에 대한 비명시적 사실

- **104개 도구 페이지 전부 `"use client"`** — 계산은 모두 브라우저에서. 서버 컴포넌트로 바꾸지 말 것 (interactive 폼).
- **각 도구는 `page.tsx` + `layout.tsx` 쌍**. 페이지 단위 metadata·JSON-LD를 분리하기 위함. metadata는 항상 layout 쪽에 둘 것 — `"use client"` page에서는 `export const metadata`를 쓸 수 없으므로.
- **`src/app/api/exchange/route.ts`, `src/app/api/coin/route.ts`** — 외부 환율·코인 시세 프록시. `revalidate = 3600`로 ISR 캐싱. 직접 외부 API를 클라이언트에서 부르지 말고 이 프록시를 통할 것 (CORS·키 격리).
- **`src/app/sitemap.ts`** — `tools.ts`와 `src/lib/posts`의 `POSTS`를 합쳐 자동 생성. 정적 URL 하드코딩하지 말고 데이터에 추가.
- **`src/app/manifest.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`** — Next.js 메타 파일 컨벤션. 손댈 때 위 "Next.js 16과 다르다" 경고 적용.
- **테마 부트스트랩** — `src/app/layout.tsx` `<head>`에 들어있는 인라인 스크립트가 `localStorage['calai-theme']`을 읽어 hydration 전에 `dark` 클래스를 붙인다. FOUC 방지용이므로 제거하지 말 것.
- **블로그** — `src/lib/posts/<slug>.ts` 각 파일이 `export const post` 로 객체 export, `src/lib/posts/index.ts`가 `POSTS` 배열로 묶음. `/blog`, `/blog/[slug]`가 이 배열을 소비.

## 입력 컴포넌트 / 톤 일관성

- 금액·수량 입력: `src/components/NumberInput.tsx` 사용 (천 단위 콤마 자동 포매팅 + onBlur min 검증).
- 단위 라벨은 input을 `relative` 래퍼로 감싸고 `<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">단위</span>` 패턴 (예: `car-tax/page.tsx`, `gpa/page.tsx`).
- 다크모드: 모든 Tailwind 클래스에 `dark:` 변종 함께 작성. 기본 색 팔레트는 `slate` + 강조 `indigo-600`.
