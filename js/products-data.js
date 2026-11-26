/* ==========================================================================
   ORCHEM 제품 데이터 (목록·상세 페이지 공용)
   출처: 2026년 전단지(국문) Products Line-up, 2026 KPCA 국문 판넬(좌측),
         orchem.com 제품정보 > Chemicals, 회사소개서 PPTX
   ※ 수치·특징은 위 자료 문구 그대로 사용. 임의 추가 금지.

   [제품 추가 방법]
   - 기존 카테고리에 제품 추가: 해당 카테고리 lineup.rows 에 한 줄 추가
     (상세 설명·사진이 있으면 showcase 에도 추가)
   - 새 카테고리: ORC_CATEGORIES 배열에 객체 추가 → product.html?id=<id> 로 자동 생성
   ========================================================================== */
window.ORC_PROCESS = [
  /* PCB 전공정 (orchem.com Chemicals). cat: 오알켐 제품 카테고리 id */
  { name: '원판' },
  { name: '적층', cat: 'stacking' },
  { name: 'Drill' },
  { name: '화학동', cat: 'eless-cu' },
  { name: '전기동', cat: 'electro-cu' },
  { name: 'D/F 전처리', cat: 'etchant-cleaner' },
  { name: 'D/F 박리', cat: 'dfr-stripper' },
  { name: 'PSR' },
  { name: '금도금' },
  { name: '검사·포장' }
];

window.ORC_CATEGORIES = [
  /* ------------------------------------------------------------------ */
  {
    id: 'eless-cu',
    no: '01',
    en: "Electroless Copper Plating",
    name: '무전해 화학동도금',
    series: 'ORC-400 series · ORC-445 촉매',
    process: '화학동',
    summary: 'Desmear부터 촉매, 무전해 동도금까지 홀 내벽과 표면에 전도성을 부여하는 화학동 공정 약품입니다.',
    badges: ['PCB 무전해 동도금 시장 한국 1위', '2023 세계일류상품 인증'],
    features: [
      '중화 Conditioning 기능 강화',
      '다양한 라인 특성에 맞게 적용',
      'Hole 내벽 Coverage 우수',
      'P.I film 밀착력 우수',
      'Rigid · Flexible 대응 가능',
      '수평 · 수직 라인 가능'
    ],
    lineup: {
      title: '무전해 화학동도금 제품 Line-up (ORC-400 series)',
      columns: ['제품명', 'Type', '사업군', '구성', '특징'],
      rows: [
        { code: 'ORC-464', cells: ['수평', 'HDI, MLB', '3액형 (M, A, B)'],
          features: ['Rochelle Salt Type', '이온타입 촉매', '저유전율 자재 대응 우수', '약품 수율(소모량) 우수', '도금 두께 낮음', '건욕 Ni 함량 낮음 (250 ppm)', '석출 안정성 우수'] },
        { code: 'ORC-F463', cells: ['수평', 'RFPCB, FPCB', '5액형 (N, MI, MII, A, B)'],
          features: ['Rochelle Salt Type', '이온타입 촉매', 'Polyimide, Coverlay, Bonding Sheet, Film 등 Coverage 우수', '내굴곡성 자재 대응 우수', '석출 안정성 우수'] },
        { code: 'ORC-H463', cells: ['수평', 'RFPCB, FPCB', '6액형 (N, MI, MII, A, B, C)'],
          features: ['Rochelle Salt Type', '이온타입 촉매', 'Polyimide, Coverlay, Bonding Sheet, Film 등 Coverage 우수', '내굴곡성 자재 대응 우수', 'RA Copper Foil 전용', 'HA Copper Foil 전용', '석출 안정성 우수'] },
        { code: 'ORC-P463', cells: ['수평', 'PKG, HDI, RFPCB (Horizontal MSAP)', '3액형 (M, A, B)'],
          features: ['Rochelle Salt Type', '이온타입 촉매', 'PKG 자재 Excellent Coverage', 'BVH, PTH T.P 우수', '도금두께 Control 용이', '석출 안정성 우수'] },
        { code: 'ORC-HV463', cells: ['수직', 'PKG (Vertical SAP)', '3액형 (M, A, B)'],
          features: ['Rochelle Salt Type', '이온타입 촉매', 'PKG 자재 Excellent Coverage', 'BVH, PTH T.P 우수', 'ABF 도금 접착력 우수', '도금두께 Control 용이', '석출 안정성 우수'] }
      ]
    },
    extra: [
      { title: 'Colloid Type', items: ['Light Cu: ORC-470, ORC-4650', 'Heavy Cu: ORC-465, ORC-467'] },
      { title: '촉매', items: ['ORC-445R PLUS (장 수명, Pd 180~250 ppm)', 'ORC-445 ProM (중 농도, Pd 120~180 ppm)', 'ORC-445 ProMex (저 농도, Pd 70~120 ppm)'] }
    ],
    showcase: [
      { code: 'ORC-464', label: 'HDI', img: 'orc-464.jpg', w: 1401, h: 356,
        points: ['낮은 도금 두께 대비 높은 Coverage 우수', '높은 액 안정성 (석출 안정성 확보)', '전장, 네트워크, 모바일 등 다양한 기판 대응'],
        caption: 'Hole Coverage 우수 · 도금두께 0.531 ~ 0.590 ㎛' },
      { code: 'ORC-F463 · ORC-H463', label: 'FPCB', img: 'orc-f463.jpg', w: 1401, h: 346,
        points: ['PI Film, Low Dk, Glass Fiber Coverage 우수', 'PI Open 부 밀착력 강화', 'HA Cu 도금 거침 대응 가능 (Cu 표면 친화 첨가제 적용)'],
        caption: 'PI Open 부 밀착력 · 다양한 FPCB 자재 커버리지 · HA Cu 거침 현상 개선' },
      { code: 'ORC-P463', label: 'PKG', img: 'orc-p463.jpg', w: 1401, h: 399,
        points: ['도금 계면 밀착력 우수', 'Nano Vacant 최소화', '화학동 Coverage 및 C.P (%) 강화'],
        caption: '화학동 계면 부 Nano Pore 미 관찰' },
      { code: 'ORC-HV463', label: 'fcBGA · 수직화학동', img: 'orc-hv463.jpg', w: 1401, h: 380,
        points: ['초기 반응성 및 도금 안정성 우수 (석출 안정성 검증)', 'ABF 자재 별 도금 접착력 및 계면 밀착력 우수', '화학동 Hole Coverage 우수', 'Peel Strength — GX-92R: ORC 0.73 / A社 0.64 / B社 0.56 kgf/㎝', 'Peel Strength — GL-102: ORC 0.54 / B社 0.43 / A社 0.33 kgf/㎝'],
        caption: 'Peel Strength (ORC vs. Competitors) · LVH, Hole Coverage' },
      { code: 'ORC-445R PLUS', label: '장 수명 촉매', img: 'catalyst-4w.jpg', w: 1251, h: 329,
        points: ['촉매 안정성 극대화 (장 수명: 4주 이상 사용)', '다중 Ligand 적용', '이온 타입 PTH 공정의 이물 발생 개선', '작업 Pd 농도 180 ~ 250 ppm'],
        caption: '촉매 4주 사용 도금 신뢰성 확보' }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'electro-cu',
    no: '02',
    en: 'Electrolytic Copper Plating',
    name: '전기동도금',
    series: 'ORC-800 series · Zenith series',
    process: '전기동',
    summary: '일반 PTH 도금부터 Via Fill, Pattern Fill, 펄스 도금까지 공정 조건에 맞춘 전해동도금 약품입니다.',
    badges: ['PCB Via Fill 국내 최초 제품 개발', 'TGV Full Fill 대응'],
    features: [
      'High aspect ratio 도금 적합',
      '우수한 Throwing power',
      '낮은 도금 두께에서 탁월한 Fill rate 구현',
      '안정적인 첨가제 분석',
      'Dimple Free'
    ],
    lineup: {
      title: '전기 동도금 제품 Line-up (ORC-800 · Zenith series)',
      columns: ['제품명', '구분 / 용도', '사업군', '구성', '특징'],
      rows: [
        { code: 'ORC-813', cells: ['Soluble (함인동) · 일반도금', 'MLB', '3액형 (M, R, C)'],
          features: ['PTH 일반 도금 用'] },
        { code: 'ORC-814', cells: ['Insoluble (산화동) · 일반도금', 'HDI, FPCB, MLB', '2액형 (A, B)'],
          features: ['PTH 일반 도금 用'] },
        { code: 'ORC-814H', isNew: true, cells: ['Insoluble · 일반, Half Fill 도금', 'HDI, FPCB, MLB', '2액형 (A, B)'],
          features: ['BVH T.P 100%↑', '사양 별 VMS 조절 가능'] },
        { code: 'Zenith-800', cells: ['Insoluble · 내,외층 Via Fill 도금', 'HDI, FPCB', '3액형 (B, L, C)'],
          features: ['BVH & PTH (동시도금)', 'Dimple Free'] },
        { code: 'Zenith-850', isNew: true, cells: ['Insoluble · Pattern Fill 도금', 'PKG', '3액형 (B, L, C)'],
          features: ['Pattern & BVH Fill 用', '사양 별 VMS 조절 가능', '0.2T 미만 PTH Fill 대응', '회로 L/S 10㎛↓ 대응'] },
        { code: 'Zenith-910', isNew: true, cells: ['Insoluble · 내층 고속 Fill 도금', 'HDI, FPCB', '3액형 (B, L, C)'],
          features: ['내층 BVH Fill 도금 用', '도금시간 단축', '저 전류 전용', 'Seam Void Free'] },
        { code: 'Zenith-1000 · Zenith-1500', isNew: true, cells: ['Insoluble · Pulse 도금', '반도체, PKG, MLB', '3액형 (B, L, C)'],
          features: ['TGV Full Fill 대응', '0.15 ~ 1.0T', '기타 소재 대응 가능', 'Glass, Resin 外'] }
      ]
    },
    showcase: [
      { code: 'ORC-813 · ORC-814', label: '일반도금', img: 'orc-813.jpg', w: 1401, h: 536,
        points: ['가용성 / 불용성 양극 대응 가능', '우수한 Throwing Power', '3액형 약품으로 성능 제어 용이'],
        caption: 'Hole Size Φ100 ㎛, Depth 75 ㎛ / Hole Size Φ120 ㎛, Depth 75 ㎛' },
      { code: 'ORC-814H', label: '하프 비아필', img: 'orc-814h.jpg', w: 1401, h: 340,
        points: ['다양한 제품 사양 대응 가능', 'BVH Throwing Power 100%↑', '첨가제 2액형 약품 타입'] },
      { code: 'Zenith-800', label: '일반 비아필', img: 'zenith-800.jpg', w: 527, h: 999, tall: true,
        points: ['도금 성장속도 개선', 'LVH / PTH 동시 적용 가능', '3액형 약품으로 성능 제어 용이'],
        caption: 'T/P 90.4 % · 표면도금두께 12.5 ㎛ · Wall (weak) 11.3 ㎛' },
      { code: 'Zenith-850', label: '패턴 비아필', img: 'zenith-850.jpg', w: 1401, h: 663,
        points: ['Pattern부 Suppressing 극대화', 'Flat Pattern Shape 형성', '3액형 약품으로 성능 제어 용이'],
        caption: 'LTH / Small BVH, L/S (F.R. 6.12 %) / Large BVH, L/S (F.R. 9.80 %)' },
      { code: 'Zenith-910', label: '고속 비아필', img: 'zenith-910.jpg', w: 1401, h: 413,
        points: ['저 두께 / 고 Depth 도금 대응 가능', '방향족 고리에 의한 高 흡착 첨가제 (억제력 강화)', '3액형 약품으로 성능 제어 용이'],
        caption: '저 두께 대응 가능 (8 ㎛~) · 도금 시간 단축 가능 (40 min)' },
      { code: 'Zenith-1000', label: '펄스 도금', img: 'zenith-1000.jpg', w: 1401, h: 339,
        points: ['도금시간 단축 & 단일 Bath 적용', 'Vacant Free', '3액형 약품으로 성능 제어 용이'],
        caption: 'PTH Fill Performance (Bridge · Via Fill)' }
    ],
    related: { href: 'technology.html#core', text: 'TGV Fill 도금 기술 자세히 보기' }
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'dfr-stripper',
    no: '03',
    en: 'DFR Stripper',
    name: 'DFR 박리제',
    series: 'ORC-700 series · Vacuus series',
    process: 'D/F 박리',
    summary: '회로 형성 후 Dry Film을 제거하는 박리 공정 약품으로, 무기염·Amine·TMAH Free·특수기판용까지 Type별로 보유하고 있습니다.',
    badges: ['친환경 TMAH Free 박리제 보유'],
    features: [
      'Type별 D/F 박리제 보유',
      '일정한 박리 속도 · 입자 크기',
      '낮은 R-cost (폐수처리 용이)',
      'Fine pattern 및 PKG 공정 가능',
      '고밀도 회로의 Fine pitch 사이에도 쉽게 침투하여 신속 박리'
    ],
    lineup: {
      title: 'DF 박리 관련 제품 Line-up (ORC-700 · Vacuus series)',
      columns: ['제품명', 'Type', '사업군', '구성', '특징'],
      rows: [
        { code: 'DFS-4522', cells: ['NaOH Type', 'HDI, MLB', '1액형'],
          features: ['무기염 Type 일반 박리제', 'Amine Type 대비 친환경'] },
        { code: 'ORC-730', cells: ['KOH Type', 'HDI, MLB', '1액형'],
          features: ['무기염 + TMAH Type 일반 박리제', 'Amine Type 대비 친환경'] },
        { code: 'ORC-725A', cells: ['Amine Type (TMAH)', 'HDI, MLB', '2액형 (A, B)'],
          features: ['HDI 용 TMAH Type 박리제'] },
        { code: 'Vacuus-50 (V-50)', isNew: true, cells: ['무기염 Type', 'HDI, MLB', '1액형 (첨가제)'],
          features: ['무기염 첨가제 用', '박리 성능/속도 개선'] },
        { code: 'Vacuus-100 · 150 (V-100 · V-150)', isNew: true, cells: ['Amine Type (TMAH)', 'HDI, PKG', '2액형 (A, B)'],
          features: ['고두께 Dry Film 박리 用', '고객사 기판에 따른 Inhibitor 변경 가능'] },
        { code: 'Vacuus-200 (ORC-DFR2)', isNew: true, cells: ['Amine Type (TEAH)', 'HDI, PKG', '2액형 (A, B)'],
          features: ['친환경 TMAH Free 박리제', 'HDI, PKG 적용 가능', '고객사 기판에 따른 Inhibitor 변경 가능'] },
        { code: 'SF-300', isNew: true, cells: ['특수기판 전용', 'PKG (PPG 잔사 用)', '2액형 (A, B)'],
          features: ['PPG 위 잔사 제거 用', '일반 박리 성능 다소 저하'] },
        { code: 'Vacuus-300 (V-300)', isNew: true, cells: ['특수기판 전용', 'PKG (PPG 잔사 用)', '2액형 (A, B)'],
          features: ['全 고객사용 PPG 위 잔사 제거 박리제'] }
      ]
    },
    showcase: [
      { code: 'Vacuus-100', label: 'PKG 用', img: 'vacuus.jpg', w: 1401, h: 371,
        points: ['Amine Type PKG 用 박리제', '미세패턴 / 고 두께 대응 가능', '낮은 Cu Etching Rate / 회로 손실율 개선', '박리편 크기 조절 가능'],
        caption: 'Overhang Strip 평가 (박리 전 · 후) · Inhibitor 반응' },
      { code: 'Vacuus-200', label: 'TMAH Free',
        points: ['친환경 TMAH Free 박리제', '첨가제 사용으로 Cu Attack 최소화', '공정 조건 / 기판에 대한 범용성 확보'] },
      { code: 'Vacuus-300', label: 'Selective 用',
        points: ['Amine Type Selective 用 박리제', '절연층 위 Dry Film 제거력 우수', 'Au / PPG Morphology 유기 가능'] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'stacking',
    no: '04',
    en: 'Stacking Solution',
    name: '적층 (Oxide · 유기산 에칭)',
    series: 'Oxide · LOMACS series',
    process: '적층',
    summary: '적층 공정에서 동 표면과 절연층의 밀착력을 확보하는 Oxide 및 유기산 에칭 약품입니다.',
    badges: ['국내 Oxide 시장 高점유율'],
    features: [
      'Brown oxide',
      '적층 및 LDD 공정 적용 가능',
      '국내 Oxide 시장 高점유율'
    ],
    lineup: {
      title: 'Stacking Solution 제품 Line-up',
      columns: ['제품명', 'Type', '구분', '특징'],
      rows: [
        { code: 'ORC-190K', cells: ['유기산 에칭 Type', '일반'], features: [] },
        { code: 'LOMACS-100', cells: ['유기산 에칭 Type', '유기산 전처리'],
          features: ['균일한 표면 거칠기 형성', '농도에 따른 Cu Etching Rate 변화 없음', '높은 열 안정성 확보'] },
        { code: 'LOMACS-300', cells: ['유기산 에칭 Type', '저에칭 유기산 적층 (Cu E/R 1.0 ㎛)'],
          features: ['우수한 적층 밀착력 형성', '균일한 Nano Size 요철 형태 구현', '첨가제 보충에 따른 성능 변화 無'] },
        { code: 'LOMACS-500', cells: ['유기산 에칭 Type', '저에칭 (E/R < 1.0 ㎛)'], features: [] },
        { code: 'LOMACS-310', cells: ['유기산 에칭 Type', '무에칭 유기산 적층 (Cu E/R 0.1 ㎛)'],
          features: ['적층 / PSR 전처리 용 유기산 에칭제', '낮은 Cu Etching Rate로 회로 손실 최소화', '자체 개발 A.P. 사용으로 밀착력 향상'] },
        { code: 'A·P + Lomacs', cells: ['유기산 에칭 Type', '무에칭 (E/R < 0.1 ㎛)'],
          features: ['Adhesion Promotor'] },
        { code: 'ORC-263TMR', cells: ['Oxide Type', 'Brown'], features: [] },
        { code: 'ORC-283', cells: ['Oxide Type', 'Black'], features: [] }
      ]
    },
    showcase: []
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'etchant-cleaner',
    no: '05',
    en: 'Etchant & Cleaner',
    name: 'Etchant & Cleaner (D/F 전처리)',
    series: 'Etchant · Cleaner',
    process: 'D/F 전처리',
    summary: 'Dry Film 공정 전 동 표면을 처리하는 Type별 에칭제와 세정제입니다.',
    badges: [],
    features: [
      'Type별 에칭제 보유 (H2SO4/H2O2, Nitric acid, Organic acid)',
      '다양한 용도 가능 (Soft, Half, Flash & Quick)'
    ],
    lineup: {
      title: 'Etchant & Cleaner 제품 Line-up',
      columns: ['제품명', '구분', 'Type', '특징'],
      rows: [
        { code: 'ORC-130', cells: ['Etchant', '황산/과수 Type'], features: [] },
        { code: 'ORC-124SL', cells: ['Etchant', 'SPS Type'], features: [] },
        { code: 'ORC-170F', cells: ['Etchant', '질산 Type'], features: [] },
        { code: 'ORC-190K', cells: ['Etchant', '유기산 Type'], features: [] },
        { code: 'SFAC-100', cells: ['Cleaner', 'S Free Type'], features: ['S-Free D/F Acid Cleaner (2025 개발)'] }
      ]
    },
    showcase: []
  }
];
