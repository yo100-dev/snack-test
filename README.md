# K-Snack Basak

(구 Snackdex. 저장 키·배포 주소에는 옛 이름이 남아 있다)

한국 마트에서 과자를 고를 때 보는, 내 언어 쇼핑 도감.
손에 든 봉지를 화면 속 사진과 맞춰보고, 맛을 이해하고, 살 것을 저장한다.

- **정적 사이트** (Astro 5). 서버 없음, 로그인 없음, 무료 호스팅 가능
- **모바일 우선.** 마트 안에서 한 손으로 보는 화면이 기준. PC는 후순위
- **언어별 URL** — `/en/…`, `/ja/…`. hreflang·canonical·JSON-LD 자동 생성
- 현재 제품 21개, 가이드 3편, 총 53페이지

## 실행

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 배포용 vanilla 사이트를 dist/에 생성
npm run build:astro # 기존 Astro 버전 별도 빌드
```

> npm 캐시가 root 소유라 설치가 막히면:
> `npm install --cache /tmp/npmcache` 또는 `sudo chown -R 501:20 ~/.npm`

## 구조

```
src/
  site.config.mjs      사이트 이름·도메인·지원 언어 (여기만 고치면 전부 반영)
  data/products.json   제품 21개. 이 파일이 사이트의 본체다
  data/guides.json     SEO 유입용 큐레이션 글
  i18n/ui.ts           화면 문구 + 카테고리·알러지 라벨
  lib/products.ts      이미지 자동 연결, 필터 데이터 생성
  layouts/Base.astro   SEO 헤드 + 쇼핑목록 스크립트
  pages/[lang]/…       언어별 라우트가 자동 생성됨
public/images/products/ 실제 배포되는 사진
_refs/                  참고용 사진 (배포 안 됨)
```

## 제품 추가하기

`src/data/products.json` 에 항목 하나 추가하면 끝이다.
언어별 상세 페이지, 카드, 필터, sitemap, JSON-LD가 전부 자동으로 따라온다.

## 언어 추가하기

1. `src/site.config.mjs` 의 `languages` 에 코드 추가 (예: `'zh'`)
2. `src/i18n/ui.ts` 의 `ui`·`categories`·`allergenLabels` 에 해당 언어 블록 추가
3. `products.json`·`guides.json` 의 각 `i18n` 에 해당 언어 추가

빠진 언어는 영어로 자동 대체되므로 사이트가 깨지지는 않는다.

## 사진

`public/images/products/<slug>.jpg` 를 넣으면 **코드 수정 없이** 자동으로 붙는다.
없으면 한국어 제품명 플레이스홀더가 뜬다.

`npm run build` 는 배포 이미지마다 `<slug>.credit.txt` (출처 한 줄)를 요구한다.
직접 찍은 사진이면 `own photo, 2026-10-01` 이면 통과.
크롤링해 온 참고 이미지는 `public/` 이 아니라 `_refs/` 에 둔다 — 자세한 건 `_refs/README.md`.

## 배포

Vercel은 `npm run build`로 `vanilla/` 버전을 `dist/`에 생성해 배포한다.
`vanilla/images/`의 사진은 배포에 포함되며, 출처 메모가 있는 사진에는 참고 사진 표시가 붙는다.
# snack-test
