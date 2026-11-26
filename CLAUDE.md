# 프로젝트: 오알켐 제품·기술 홍보 홈페이지

## 규칙
- 기술: 순수 HTML/CSS/JS (프레임워크 사용 안 함)
- 대상: B2B 고객 (구매·연구 담당자)
- 톤: 신뢰감, 전문성, 깔끔함
- 컬러
  - 메인 Mint (C72 Y30) → 웹 `#1EB5BC` (orchem.com CI 페이지 공식값)
  - 보조 Jade (C100 M55 Y55) → 웹 `#00626F` (orchem.com CI 페이지 공식값)
- 폰트: Pretendard
- 반응형 필수 (모바일/태블릿/PC)
- 제품 수치·인증 정보는 임의로 만들지 말 것. 사용자가 준 자료(이 폴더의 PDF/PPTX)와 https://orchem.com/home/main.php 에 있는 내용만 사용. 확인 불가한 정보는 비워두고 표시(TODO)할 것.
- 한국어 기본(루트), 영문은 `/en`, 중문은 `/cn` 폴더에 별도 제작

## 자료 (프로젝트 루트)
- `ORCHEM Company Profile (KOR)_ver.2_20260629.pptx` — 회사소개서
- `2026년 전단지 (국문)_오알켐.pdf` — 전단지
- `[오알켐] 2026년 KPCA 국문 판넬 (좌측/우측)_20260813_최종.pdf` — 전시 판넬
- `[오알켐] 인증 현황 (특허, ISO, 상표, 인증, 수상, 디자인 저작권).pdf` — 인증 현황
- `오알켐 로고 (민트청록_바탕투명).png`, `오알켐 로고 (화이트_바탕투명).png` — 로고

## 파일 구조·작성 규칙
- `_template.html` — 새 페이지는 이 파일을 복사해서 시작 (헤더/푸터 포함). 현재 메뉴에 `aria-current="page"`.
- `css/common.css` — 디자인 토큰(:root), 공통 컴포넌트(.container .section .btn .card .page-hero .grid 등), 헤더, 푸터. 페이지 전용 스타일은 `css/<page>.css`로 분리.
- `js/common.js` — 헤더 스크롤 상태, 모바일 메뉴, 맨 위로 버튼.
- `assets/images/` — 로고 등 이미지.
- 페이지 파일명: index.html, about.html, technology.html, products.html, contact.html (경로는 file://에서도 열리도록 상대경로)
- 브레이크포인트: 모바일 ≤768px, 태블릿 ≤1024px
- 문의 폼: `contact.html`의 form `action="https://formspree.io/f/YOUR_FORM_ID"` — 실제 ID로 교체 전에는 전송 안 됨(경고 표시). 로직은 `js/contact.js`. `contact.html?product=<제품명>`으로 제품명 자동 입력. 개인정보 고지 문구는 법무 확인 필요(TODO).
- 제품: 데이터는 `js/products-data.js` 한 곳에서 관리. `products.html`(목록)과 `product.html?id=<카테고리 id>`(상세 템플릿)를 `js/products.js`가 그림. 제품 사진은 `assets/images/products/`.
- 미리보기: `_preview/preview.html` (Edge 앱 창, 바탕화면 바로가기 "오알켐 홈페이지 미리보기" 또는 `preview.bat`). **새 페이지를 만들면 preview.html의 `PAGES` 배열에서 해당 항목을 `ready: true`로 변경.** `_preview/`는 배포 대상 아님.

## 영문(/en) · 중문(/cn) 페이지
- `en/*.html`, `cn/*.html`, `js/products-data-en.js`, `js/products-data-cn.js` 는 **자동 생성물**: 국문 페이지를 고친 뒤 `python _tools/build_en.py` 실행 → 영문·중문 재생성 (`... en` / `... cn` 으로 한 언어만도 가능). 생성물을 직접 고치지 말 것.
- 번역표: `_tools/translations_en.py`, `_tools/translations_cn.py` (T, DATA_ONLY, 페이지별 손질 POST).
  - 영문: 공식 영문 홈페이지(orchem.com/eng) 문구 우선.
  - 중문: ① `ORCHEM Company Profile (CHN)_ver.2_20260709.pptx` ② 공식 중문 홈페이지(orchem.com/chn) 순으로 우선. 용어 化学铜·电镀铜·D/F 脱膜·层压·棕化·活化剂·脱膜剂.
- 스크립트가 "번역표에 없는 한글" 목록을 출력하면 두 번역표에 모두 추가 후 다시 실행.
- 공용 JS(products.js, contact.js, home.js, common.js)는 `<html lang>`(ko/en/zh-CN)으로 문구를 고름. 다국어 페이지 body 에는 `data-base="../"`.
- 중문은 `html[lang^="zh"]` 에서 중국어 글꼴(PingFang SC / Microsoft YaHei) 사용.

## 제작 순서 (페이지 단위로 진행)
1. 공통 틀 — 헤더(로고, 메뉴), 푸터, 공통 CSS
2. 홈 — 히어로, 주력 제품 3개, 기술 강점, 문의 유도
3. 회사소개 — 회사소개서 내용 기반
4. 기술·R&D — 사용자가 주는 설명 기반
5. 제품 — 목록 페이지 + 상세 페이지 템플릿
6. 문의 — 문의 폼 (Formspree 연동)
7. 반응형 — 모바일 깨짐 점검·수정
