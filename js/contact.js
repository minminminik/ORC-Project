/* ORCHEM 문의 폼: 입력 검증 · 제품명 자동 입력 · Formspree 전송 */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'ko').indexOf('zh') === 0 ? 'zh' : document.documentElement.lang;
  var M = LANG === 'zh' ? {
    sending: '发送中…', send: '发送咨询',
    chkT: '请确认输入内容。', chkD: '请重新确认标为红色的项目。',
    subject: '[ORCHEM 官网]',
    ncT: '咨询表单尚未连接。', ncD: '输入内容验证已完成。连接 Formspree 表单地址后即可实际发送。',
    failT: '发送失败。', failD: '请稍后重试，或拨打总机 +82-31-488-0600 联系我们。',
    netT: '由于网络错误，未能发送。', netD: '请检查网络连接后重试，或拨打总机 +82-31-488-0600 联系我们。'
  } : LANG === 'en' ? {
    sending: 'Sending…', send: 'Send Inquiry',
    chkT: 'Please check your entries.', chkD: 'Please review the fields marked in red.',
    subject: '[ORCHEM Website]',
    ncT: 'The inquiry form is not connected yet.', ncD: 'Your entries passed validation. Messages will be sent once the Formspree form address is connected.',
    failT: 'Your message could not be sent.', failD: 'Please try again later or call us at +82-31-488-0600.',
    netT: 'Your message could not be sent due to a network error.', netD: 'Please check your internet connection and try again, or call us at +82-31-488-0600.'
  } : {
    sending: '보내는 중…', send: '문의 보내기',
    chkT: '입력 내용을 확인해 주세요.', chkD: '빨간색으로 표시된 항목을 다시 확인해 주세요.',
    subject: '[오알켐 홈페이지]',
    ncT: '문의 폼이 아직 연결되지 않았습니다.', ncD: '입력 확인은 정상적으로 끝났습니다. Formspree 폼 주소를 연결하면 실제로 전송됩니다. (contact.html 의 YOUR_FORM_ID 교체)',
    failT: '전송에 실패했습니다.', failD: '잠시 후 다시 시도하시거나 대표번호 031-488-0600으로 연락해 주세요.',
    netT: '네트워크 오류로 전송하지 못했습니다.', netD: '인터넷 연결을 확인한 뒤 다시 시도하시거나 대표번호 031-488-0600으로 연락해 주세요.'
  };

  var form = document.getElementById('contact-form');
  if (!form) return;

  var alertEl = document.getElementById('form-alert');
  var doneEl = document.getElementById('form-done');
  var btn = document.getElementById('submit-btn');
  var btnText = btn.querySelector('.label-text');
  var msg = document.getElementById('message');
  var counter = document.getElementById('counter');
  var NOT_CONNECTED = /YOUR_FORM_ID/.test(form.action);

  /* ---------- 1. 제품 페이지에서 넘어온 제품명 자동 입력 (contact.html?product=...) ---------- */
  try {
    var product = new URLSearchParams(location.search).get('product');
    if (product) {
      var select = document.getElementById('product_category');
      var matched = Array.prototype.some.call(select.options, function (o) {
        if (o.value && o.text === product) { select.value = o.value || o.text; return true; }
        return false;
      });
      if (!matched) document.getElementById('product').value = product;
    }
  } catch (e) {}

  /* ---------- 2. 글자 수 ---------- */
  function updateCounter() { counter.textContent = msg.value.length + ' / ' + msg.maxLength; }
  msg.addEventListener('input', updateCounter);
  updateCounter();

  /* ---------- 3. 검증 ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[0-9+\-\s()]{8,}$/;

  function isValid(input) {
    var v = (input.value || '').trim();
    if (input.type === 'checkbox') return input.checked;
    if (input.required && !v) return false;
    if (input.type === 'email' && v) return EMAIL.test(v);
    if (input.type === 'tel' && v) return PHONE.test(v);
    if (input.minLength > 0 && v.length < input.minLength) return false;
    return true;
  }
  function check(input) {
    var field = input.closest('.field');
    var ok = isValid(input);
    if (field) field.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  var required = form.querySelectorAll('input[required], textarea[required]');
  required.forEach(function (input) {
    input.addEventListener('blur', function () { if (input.value || input.type === 'checkbox') check(input); });
    input.addEventListener('input', function () { if (input.closest('.field.is-invalid')) check(input); });
    input.addEventListener('change', function () { if (input.type === 'checkbox') check(input); });
  });

  /* ---------- 4. 알림 ---------- */
  function showAlert(type, title, text) {
    alertEl.className = 'alert alert--' + type + ' is-shown';
    alertEl.innerHTML = '<strong>' + title + '</strong>' + text;
  }
  function setSending(on) {
    btn.disabled = on;
    btn.classList.toggle('is-sending', on);
    btnText.textContent = on ? M.sending : M.send;
  }

  /* ---------- 5. 전송 ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertEl.className = 'alert';

    var firstBad = null;
    required.forEach(function (input) { if (!check(input) && !firstBad) firstBad = input; });
    if (firstBad) {
      firstBad.focus();
      showAlert('error', M.chkT, M.chkD);
      return;
    }

    var type = (form.querySelector('input[name="inquiry_type"]:checked') || {}).value || '문의';
    document.getElementById('_subject').value =
      M.subject + ' ' + type + ' - ' + document.getElementById('company').value.trim() + ' ' + document.getElementById('name').value.trim();

    if (NOT_CONNECTED) {
      showAlert('warn', M.ncT, M.ncD);
      return;
    }

    setSending(true);
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        updateCounter();
        form.hidden = true;
        doneEl.classList.add('is-shown');
        doneEl.focus();
        doneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      return res.json().catch(function () { return {}; }).then(function (data) {
        var detail = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(' ') : '';
        showAlert('error', M.failT, (detail ? detail + ' ' : '') + M.failD);
      });
    }).catch(function () {
      showAlert('error', M.netT, M.netD);
    }).then(function () { setSending(false); });
  });
})();
