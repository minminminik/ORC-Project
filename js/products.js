/* ORCHEM 제품 목록 · 상세 렌더링 (데이터: js/products-data.js) */
(function () {
  'use strict';

  var CATS = window.ORC_CATEGORIES || [];
  var PROCESS = window.ORC_PROCESS || [];
  var page = document.body.getAttribute('data-page');
  var BASE = document.body.getAttribute('data-base') || '';   /* 영문(/en) 페이지는 '../' */

  /* ---------- 화면 문구 (페이지 언어별) ---------- */
  var L = ({
    ko: {
      all: '전체', biz: '사업군', feat: '특징', detail: '상세 보기',
      emptyT: '검색 결과가 없습니다', emptyD: '찾으시는 제품이 없다면 문의해 주세요.', ask: '문의하기 →',
      countCat: function (proc, name, n) { return '<strong>' + proc + '</strong> 공정 · ' + name + ' <b>' + n + '</b>개'; },
      countQ: function (n) { return '검색 결과 <b>' + n + '</b>개'; },
      countAll: function (n) { return '전체 제품 <b>' + n + '</b>개'; },
      nf: '제품을 찾을 수 없습니다', allProducts: '전체 제품 보기', site: '오알켐 ORCHEM',
      crumb: '현재 위치', home: '홈', products: '제품',
      askThis: '이 제품 문의하기', seeLineup: '라인업 보기', features: '주요 특징',
      process: '적용 공정 · PCB 전공정', extra: '추가 라인업', lineup: '제품 라인업',
      perf: '제품별 특징 · 평가 자료', inquiry: function (n) { return n + ' 문의'; },
      ctaD: '적용 공정과 사양을 알려주시면 담당자가 답변드립니다.', contact: '문의하기', others: '다른 제품'
    },
    en: {
      all: 'All', biz: 'Applications', feat: 'Features', detail: 'View Details',
      emptyT: 'No results found', emptyD: 'If you cannot find the product you are looking for, please contact us.', ask: 'Contact Us →',
      countCat: function (proc, name, n) { return '<strong>' + proc + '</strong> · ' + name + ' <b>' + n + '</b> products'; },
      countQ: function (n) { return '<b>' + n + '</b> results'; },
      countAll: function (n) { return 'All products <b>' + n + '</b>'; },
      nf: 'Product not found', allProducts: 'View All Products', site: 'ORCHEM',
      crumb: 'Breadcrumb', home: 'Home', products: 'Products',
      askThis: 'Inquire About This Product', seeLineup: 'View Line-up', features: 'Key Features',
      process: 'Application Process · PCB Process', extra: 'Additional Line-up', lineup: 'Product Line-up',
      perf: 'Features & Evaluation Data', inquiry: function (n) { return n + ' Inquiry'; },
      ctaD: 'Tell us your process and specifications, and our team will get back to you.', contact: 'Contact Us', others: 'Other Products'
    }
    ,
    zh: {
      all: '全部', biz: '应用领域', feat: '特点', detail: '查看详情',
      emptyT: '没有搜索结果', emptyD: '如果没有找到您需要的产品，请与我们联系。', ask: '咨询 →',
      countCat: function (proc, name, n) { return '<strong>' + proc + '</strong> · ' + name + ' <b>' + n + '</b>个'; },
      countQ: function (n) { return '搜索结果 <b>' + n + '</b>个'; },
      countAll: function (n) { return '全部产品 <b>' + n + '</b>个'; },
      nf: '未找到该产品', allProducts: '查看全部产品', site: 'ORCHEM',
      crumb: '当前位置', home: '首页', products: '产品',
      askThis: '咨询此产品', seeLineup: '查看产品线', features: '主要特点',
      process: '应用制程 · PCB 全制程', extra: '其他产品线', lineup: '产品线',
      perf: '产品特点 · 评估资料', inquiry: function (n) { return n + ' 咨询'; },
      ctaD: '请告诉我们您的制程和规格，我们的负责人将为您解答。', contact: '咨询', others: '其他产品'
    }
  })[(function (l) { return l.indexOf('zh') === 0 ? 'zh' : (l === 'en' ? 'en' : 'ko'); })(document.documentElement.lang || 'ko')];

  /* ---------- 유틸 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function findCat(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return null; }
  function bizIndex(cat) { return cat.lineup.columns.indexOf(L.biz) - 1; } /* cells 는 제품명 다음 열부터 */
  function contactHref(name) { return 'contact.html?product=' + encodeURIComponent(name); }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function processHTML(currentId, asButtons) {
    return PROCESS.map(function (p, i) {
      var arrow = i < PROCESS.length - 1 ? '<span class="process__arrow" aria-hidden="true">›</span>' : '';
      if (!p.cat) return '<span class="process__step">' + esc(p.name) + '</span>' + arrow;
      if (asButtons) {
        return '<button type="button" class="process__step process__step--orc" data-cat="' + p.cat + '" aria-pressed="false">' + esc(p.name) + '</button>' + arrow;
      }
      var cls = 'process__step process__step--orc' + (p.cat === currentId ? ' process__step--current' : '');
      var cur = p.cat === currentId ? ' aria-current="true"' : '';
      return '<a class="' + cls + '" href="product.html?id=' + p.cat + '"' + cur + '>' + esc(p.name) + '</a>' + arrow;
    }).join('');
  }

  /* ======================================================================
     목록 페이지
     ====================================================================== */
  function initList() {
    var listEl = document.getElementById('product-list');
    var searchEl = document.getElementById('search');
    var countEl = document.getElementById('result-count');
    var processEl = document.getElementById('process');
    var state = { cat: 'all', q: '' };

    /* 공정별 서브 메뉴: 전체 + 오알켐 제품이 적용되는 공정(= 제품 카테고리) */
    processEl.innerHTML = '<li><button type="button" data-cat="all">' + L.all + '</button></li>' +
      PROCESS.filter(function (p) { return p.cat; }).map(function (p) {
        return '<li><button type="button" data-cat="' + p.cat + '">' + esc(p.name) + '</button></li>';
      }).join('');

    function hl(text, q) {
      var t = esc(text);
      if (!q) return t;
      var i = text.toLowerCase().indexOf(q);
      if (i < 0) return t;
      return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
    }

    function render() {
      var q = state.q.trim().toLowerCase();
      var total = 0;
      var html = CATS.filter(function (c) { return state.cat === 'all' || c.id === state.cat; }).map(function (c) {
        var bi = bizIndex(c);
        var rows = c.lineup.rows.filter(function (r) {
          if (!q) return true;
          var hay = [r.code].concat(r.cells, r.features || []).join(' ').toLowerCase();
          return hay.indexOf(q) > -1;
        });
        if (!rows.length) return '';
        total += rows.length;
        var cards = rows.map(function (r) {
          var feats = (r.features || []).slice(0, 3);
          return '<a class="prod" href="product.html?id=' + c.id + '#' + slug(r.code) + '">' +
            '<span class="prod__code">' + hl(r.code, q) + (r.isNew ? '<span class="badge-new">NEW</span>' : '') + '</span>' +
            '<span class="prod__type">' + esc(r.cells[0]) + (bi < 0 ? ' · ' + esc(r.cells[1]) : '') + '</span>' +
            (bi >= 0 ? '<span class="prod__biz">' + esc(r.cells[bi]) + '</span>' : '') +
            (feats.length ? '<ul>' + feats.map(function (f) { return '<li>' + hl(f, q) + '</li>'; }).join('') + '</ul>' : '') +
            '</a>';
        }).join('');
        return '<section class="cat-block" id="' + c.id + '" aria-labelledby="h-' + c.id + '">' +
          '<div class="cat-head"><div>' +
            '<span class="cat-head__no">' + c.no + '</span><span class="cat-head__en">' + esc(c.en) + '</span>' +
            '<h2 id="h-' + c.id + '">' + esc(c.name) + '</h2>' +
            '<p>' + esc(c.summary) + '</p>' +
          '</div><a class="btn btn--outline" href="product.html?id=' + c.id + '">' + L.detail + '</a></div>' +
          '<div class="prod-grid">' + cards + '</div></section>';
      }).join('');

      listEl.innerHTML = html || '<div class="empty"><strong>' + L.emptyT + '</strong>' + L.emptyD + ' <a class="text-jade" href="contact.html">' + L.ask + '</a></div>';
      var cur = findCat(state.cat);
      countEl.innerHTML = cur
        ? L.countCat(esc(cur.process), esc(cur.name), total)
        : (q ? L.countQ(total) : L.countAll(total));

      processEl.querySelectorAll('button').forEach(function (b) {
        var on = b.dataset.cat === state.cat;
        b.setAttribute('aria-pressed', String(on));
        if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
    }

    function setCat(id) {
      state.cat = id;
      render();
      try { history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id); } catch (e) {}
    }

    processEl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      setCat(b.dataset.cat === 'all' || state.cat === b.dataset.cat ? 'all' : b.dataset.cat); /* 선택된 공정을 다시 누르면 전체 */
    });
    searchEl.addEventListener('input', function () { state.q = searchEl.value; render(); });

    var hash = location.hash.slice(1);
    if (findCat(hash)) state.cat = hash; /* 홈 등에서 products.html#eless-cu 로 들어온 경우 */
    render();
  }

  /* 상세 페이지 제목 우측 그래픽: 약품(비커) → PCB, 카테고리의 공정 이름 표시 */
  function heroMedia(cat) {
    return '<figure class="page-hero__media" aria-hidden="true">' +
      '<svg class="hero-art" viewBox="0 0 440 275" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><pattern id="pdDots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="rgba(255,255,255,.1)"/></pattern>' +
        '<linearGradient id="pdLiq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1EB5BC" stop-opacity=".7"/><stop offset="1" stop-color="#00626F" stop-opacity=".5"/></linearGradient></defs>' +
        '<rect width="440" height="275" fill="url(#pdDots)"/>' +
        /* 비커 */
        '<path d="M120 60 h70 M130 60 v60 l-40 90 a12 12 0 0 0 11 17 h108 a12 12 0 0 0 11 -17 l-40 -90 v-60" class="ln-mint"/>' +
        '<path d="M113 160 H197 L220 210 a12 12 0 0 1 -11 17 H101 a12 12 0 0 1 -11 -17 Z" fill="url(#pdLiq)"/>' +
        '<circle class="pulse" cx="150" cy="190" r="5"/><circle cx="150" cy="190" r="4" fill="#fff" opacity=".7"/>' +
        '<circle class="pulse" cx="172" cy="205" r="4" style="animation-delay:.8s"/><circle cx="172" cy="205" r="3" fill="#fff" opacity=".6"/>' +
        /* PCB 층 */
        '<rect x="250" y="150" width="150" height="16" rx="3" fill="rgba(255,255,255,.14)" class="ln"/>' +
        '<rect x="250" y="172" width="150" height="26" rx="3" fill="rgba(30,181,188,.18)" class="ln-mint"/>' +
        '<rect x="250" y="204" width="150" height="16" rx="3" fill="rgba(255,255,255,.14)" class="ln"/>' +
        '<g fill="#1EB5BC"><rect x="275" y="150" width="6" height="70"/><rect x="322" y="150" width="6" height="70"/><rect x="369" y="150" width="6" height="70"/></g>' +
        '<path class="ln" d="M215 120 C240 120 245 150 250 158"/><path class="flow" d="M215 120 C240 120 245 150 250 158"/>' +
        '<text class="t" x="325" y="134" text-anchor="middle">' + esc(cat.process) + '</text>' +
      '</svg></figure>';
  }

  /* ======================================================================
     상세 페이지
     ====================================================================== */
  function initDetail() {
    var params = new URLSearchParams(location.search);
    var cat = findCat(params.get('id')) || null;
    var root = document.getElementById('detail');

    if (!cat) {
      document.title = L.nf + ' | ' + L.site;
      root.innerHTML = '<section class="section"><div class="container empty"><strong>' + L.nf + '</strong>' +
        '<a class="btn btn--outline" href="products.html" style="margin-top:16px">' + L.allProducts + '</a></div></section>';
      return;
    }

    document.title = cat.name + ' | ' + L.site;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', cat.name + ' (' + cat.series + ') — ' + cat.summary);
    ['ko', 'en', 'zh'].forEach(function (l) {
      document.querySelectorAll('.lang a[lang="' + l + '"]').forEach(function (a) { a.href = a.getAttribute('href') + '?id=' + cat.id; });
    });

    var lu = cat.lineup;
    var heads = lu.columns.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('');
    var rows = lu.rows.map(function (r) {
      var cells = r.cells.map(function (v, i) { return '<td data-label="' + esc(lu.columns[i + 1]) + '">' + esc(v) + '</td>'; }).join('');
      var feats = r.features && r.features.length
        ? '<ul>' + r.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>'
        : '<span class="text-muted">—</span>';
      return '<tr id="' + slug(r.code) + '"><th scope="row">' + esc(r.code) + (r.isNew ? '<span class="badge-new">NEW</span>' : '') + '</th>' +
        cells + '<td class="features" data-label="' + L.feat + '">' + feats + '</td></tr>';
    }).join('');

    var withImg = (cat.showcase || []).filter(function (s) { return s.img; });
    var noImg = (cat.showcase || []).filter(function (s) { return !s.img; });
    function showHTML(s) {
      var cls = 'show' + (s.img ? (s.tall ? ' show--tall' : '') : ' show--noimg');
      var media = s.img
        ? '<div class="show__media"><figure><img src="' + BASE + 'assets/images/products/' + s.img + '" alt="' + esc(s.code + ' ' + (s.caption || s.label)) + '" width="' + s.w + '" height="' + s.h + '" loading="lazy">' +
          (s.caption ? '<figcaption>' + esc(s.caption) + '</figcaption>' : '') + '</figure></div>'
        : '';
      return '<article class="' + cls + '"><div class="show__body"><div><span class="show__label">' + esc(s.label) + '</span><h3>' + esc(s.code) + '</h3></div>' +
        '<ul class="check-list">' + s.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>' + media + '</article>';
    }

    var extra = (cat.extra || []).map(function (g) {
      return '<div><h3>' + esc(g.title) + '</h3><ul>' + g.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
    }).join('');

    var others = CATS.filter(function (c) { return c.id !== cat.id; }).map(function (c) {
      return '<a href="product.html?id=' + c.id + '"><span>' + c.no + ' · ' + esc(c.en) + '</span><strong>' + esc(c.name) + '</strong></a>';
    }).join('');

    root.innerHTML =
      '<section class="page-hero pd-hero"><div class="container page-hero__inner"><div>' +
        '<ol class="breadcrumb" aria-label="' + L.crumb + '"><li><a href="index.html">' + L.home + '</a></li><li><a href="products.html">' + L.products + '</a></li><li aria-current="page">' + esc(cat.name) + '</li></ol>' +
        '<p class="eyebrow">' + cat.no + ' · ' + esc(cat.en) + '</p>' +
        '<h1>' + esc(cat.name) + '</h1>' +
        '<p class="pd-hero__series">' + esc(cat.series) + '</p>' +
        '<p>' + esc(cat.summary) + '</p>' +
        (cat.badges.length ? '<ul class="pd-hero__badges">' + cat.badges.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="pd-hero__actions"><a class="btn btn--primary" href="' + contactHref(cat.name) + '">' + L.askThis + '</a>' +
        '<a class="btn btn--ghost" href="#lineup">' + L.seeLineup + '</a></div>' +
      '</div>' + heroMedia(cat) + '</div></section>' +

      '<section class="section"><div class="container pd-overview">' +
        '<div class="pd-panel"><h2>' + L.features + '</h2><ul class="check-list">' + cat.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' +
        '<div><div class="pd-panel"><h2>' + L.process + '</h2><div class="process">' + processHTML(cat.id, false) + '</div></div>' +
        (extra ? '<div class="pd-panel pd-extra"><h2>' + L.extra + '</h2>' + extra + '</div>' : '') + '</div>' +
      '</div></section>' +

      '<section class="section section--soft" id="lineup"><div class="container">' +
        '<div class="section-head"><p class="eyebrow">Line-up</p><h2 class="section-title">' + L.lineup + '</h2></div>' +
        '<div class="table-wrap"><table class="lineup"><caption>' + esc(lu.title) + '</caption><thead><tr>' + heads + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</div></section>' +

      (withImg.length || noImg.length
        ? '<section class="section" id="detail-data"><div class="container">' +
            '<div class="section-head"><p class="eyebrow">Performance</p><h2 class="section-title">' + L.perf + '</h2></div>' +
            (withImg.length ? '<div class="showcase">' + withImg.map(showHTML).join('') + '</div>' : '') +
            (noImg.length ? '<div class="showcase showcase--compact" style="margin-top:16px">' + noImg.map(showHTML).join('') + '</div>' : '') +
            (cat.related ? '<p style="margin-top:24px"><a class="more-link" style="padding-top:0" href="' + cat.related.href + '">' + esc(cat.related.text) + ' ' + ARROW + '</a></p>' : '') +
          '</div></section>'
        : '') +

      '<section class="section section--soft"><div class="container">' +
        '<div class="pd-cta"><div><h2>' + esc(L.inquiry(cat.name)) + '</h2><p>' + L.ctaD + '</p></div>' +
        '<a class="btn btn--primary" href="' + contactHref(cat.name) + '">' + L.contact + '</a></div>' +
        '<h2 class="sub-title" style="margin:clamp(48px,6vw,72px) 0 20px;font-size:var(--fs-h3)">' + L.others + '</h2>' +
        '<div class="cat-nav">' + others + '</div>' +
      '</div></section>';

    /* #제품코드 로 들어온 경우 해당 행 강조 후 이동 */
    var target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) {
      target.classList.add('is-target');
      setTimeout(function () { target.scrollIntoView({ block: 'center' }); }, 50);
    }
  }

  if (page === 'products') initList();
  if (page === 'product') initDetail();
})();
