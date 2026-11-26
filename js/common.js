/* ORCHEM 공통 스크립트: 헤더 스크롤 상태, 모바일 메뉴, 맨 위로 버튼 */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var gnb = document.getElementById('gnb');
  var toTop = document.querySelector('.to-top');
  var mqTablet = window.matchMedia('(max-width: 1024px)');

  /* 스크롤 시 헤더 그림자 + 맨 위로 버튼 */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 모바일 메뉴 */
  function setMenu(open) {
    if (!toggle || !gnb) return;
    toggle.setAttribute('aria-expanded', String(open));
    var lg = (document.documentElement.lang || 'ko').slice(0, 2);
    var LBL = { en: ['Close menu', 'Open menu'], zh: ['关闭菜单', '打开菜单'] }[lg] || ['메뉴 닫기', '메뉴 열기'];
    toggle.setAttribute('aria-label', open ? LBL[0] : LBL[1]);
    gnb.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  }

  if (toggle && gnb) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    gnb.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && gnb.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    /* PC 폭으로 돌아가면 메뉴 상태 초기화 */
    var onChange = function (e) { if (!e.matches) setMenu(false); };
    if (mqTablet.addEventListener) mqTablet.addEventListener('change', onChange);
    else mqTablet.addListener(onChange);
  }

  /* 맨 위로 */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 서브 탭(.subnav): 현재 보고 있는 섹션 표시 */
  var subnav = document.querySelector('.subnav');
  if (subnav && 'IntersectionObserver' in window) {
    var links = subnav.querySelectorAll('a[href^="#"]');
    var map = {};
    links.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) map[sec.id] = a;
    });
    var setActive = function (id) {
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      var a = map[id];
      if (!a) return;
      a.setAttribute('aria-current', 'true');
      /* 모바일에서 가로 스크롤 탭이 화면 밖이면 보이게 */
      var list = a.parentElement.parentElement;
      var left = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
      list.scrollTo({ left: left, behavior: 'smooth' });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* 가로 타임라인(.htl): 이전/다음 버튼, 끝에 닿으면 버튼 비활성 */
  document.querySelectorAll('.htl').forEach(function (root) {
    var track = root.querySelector('.htl__track');
    var prevBtn = root.querySelector('[data-dir="-1"]');
    var nextBtn = root.querySelector('[data-dir="1"]');
    if (!track || !prevBtn || !nextBtn) return;
    function step() {
      var item = track.querySelector('.htl__item');
      var w = item ? item.getBoundingClientRect().width : 240;
      return Math.max(w, Math.floor(track.clientWidth / w) * w); /* 보이는 칸 수만큼 이동 */
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= max;
      root.classList.toggle('is-end', track.scrollLeft >= max);
    }
    [prevBtn, nextBtn].forEach(function (b) {
      b.addEventListener('click', function () { track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' }); });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* 저작권 연도 */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
