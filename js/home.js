/* 홈 대문 슬라이드
   - INTERVAL 마다 자동 전환, 점(●) 버튼으로 이동, 멈춤/재생 버튼
   - 마우스를 올리거나 키보드 포커스가 들어오면 잠시 멈춤
   - '동작 줄이기' 설정 사용자는 자동 전환 없이 시작 */
(function () {
  'use strict';

  var INTERVAL = 6000; /* 슬라이드 전환 간격(ms) — 여기만 바꾸면 됩니다 */

  var hero = document.getElementById('hero');
  if (!hero) return;
  var copies = hero.querySelectorAll('.hero__copy');
  var visuals = hero.querySelectorAll('.hero__visual');
  var bgs = hero.querySelectorAll('.hero__bg');
  var dots = hero.querySelectorAll('.hero__dot');
  var pauseBtn = hero.querySelector('.hero__pause');
  var countEl = document.getElementById('hero-current');
  var total = copies.length;
  if (total < 2) return;

  hero.style.setProperty('--hero-interval', INTERVAL + 'ms');

  var current = 0;
  var timer = null;
  var startedAt = 0;
  var remaining = INTERVAL;
  var userPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverPaused = false;

  function show(i) {
    current = (i + total) % total;
    [copies, visuals, bgs].forEach(function (list) {
      list.forEach(function (el, n) {
        el.classList.toggle('is-active', n === current);
        if (list !== bgs) el.setAttribute('aria-hidden', String(n !== current));
      });
    });
    dots.forEach(function (d, n) {
      d.setAttribute('aria-current', String(n === current));
      /* 진행 막대 애니메이션 재시작 */
      var bar = d.querySelector('span');
      bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    });
    if (countEl) countEl.textContent = ('0' + (current + 1)).slice(-2);
    remaining = INTERVAL;
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (userPaused || hoverPaused) return;
    startedAt = Date.now();
    timer = setTimeout(function () { show(current + 1); }, remaining);
  }

  function pauseTimer() {
    if (timer) {
      clearTimeout(timer); timer = null;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    }
  }

  function render() {
    var paused = userPaused || hoverPaused;
    hero.classList.toggle('is-paused', paused);
    var lg = (document.documentElement.lang || 'ko').slice(0, 2);
    var LBL = { en: ['Play slideshow', 'Pause slideshow'], zh: ['播放幻灯片', '暂停幻灯片'], ko: ['슬라이드 자동 넘김 재생', '슬라이드 자동 넘김 멈추기'] }[lg] || ['슬라이드 자동 넘김 재생', '슬라이드 자동 넘김 멈추기'];
    pauseBtn.setAttribute('aria-label', userPaused ? LBL[0] : LBL[1]);
    if (paused) pauseTimer(); else schedule();
  }

  dots.forEach(function (d, n) { d.addEventListener('click', function () { show(n); }); });
  pauseBtn.addEventListener('click', function () { userPaused = !userPaused; render(); });

  hero.addEventListener('mouseenter', function () { hoverPaused = true; render(); });
  hero.addEventListener('mouseleave', function () { hoverPaused = false; render(); });
  hero.addEventListener('focusin', function () { hoverPaused = true; render(); });
  hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) { hoverPaused = false; render(); } });

  /* 다른 탭으로 가면 멈춤 */
  document.addEventListener('visibilitychange', function () {
    hoverPaused = document.hidden; render();
  });

  render();
})();
