# -*- coding: utf-8 -*-
"""
국문 페이지 → 영문(/en) · 중문(/cn) 페이지 생성기

  사용법 (프로젝트 폴더에서):
    python _tools/build_en.py          # 영문 + 중문 모두
    python _tools/build_en.py en       # 영문만
    python _tools/build_en.py cn       # 중문만

- 국문 HTML 을 복사해 경로(../css 등)·언어 표시·언어 선택 링크를 바꾸고,
  _tools/translations_<언어>.py 의 번역표로 화면 글자를 교체합니다.
- 제품 데이터는 js/products-data.js → js/products-data-<언어>.js 로 번역해 만듭니다.
- 번역표에 없는 한글이 남으면 목록으로 출력합니다 → 번역표에 추가 후 다시 실행.
※ en/ · cn/ 폴더 파일은 이 스크립트가 덮어씁니다. 번역은 번역표에서 고치세요.
"""
import os, re, sys, importlib
try: sys.stdout.reconfigure(encoding="utf-8")   # Windows 콘솔에서 한글/기호 출력
except Exception: pass
sys.path.insert(0, os.path.dirname(__file__))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "about.html", "technology.html", "products.html", "product.html", "contact.html"]
# 한글 + 국문 자료에 섞여 쓰이는 한자 표기(用 外 社 高 無 全 長 非) 도 번역 대상
HANGUL = re.compile(r"[가-힣]")
MIXED = re.compile(r"[가-힣]|(?<![一-鿿])[用外社高無全長非](?![一-鿿])")

LANGS = {
  "en": {"dir": "en", "html_lang": "en", "label": "ENG", "corp": "https://orchem.com/eng/main.php", "zh": False},
  "cn": {"dir": "cn", "html_lang": "zh-CN", "label": "中文", "corp": "https://orchem.com/chn/main.php", "zh": True},
}

def norm(s): return " ".join(s.split())

def make_lookup(T):
    def lookup(s, extra=None):
        k = norm(s)
        for d in ([extra] if extra else []) + [T]:
            if k in d: return d[k]
            if k.replace("&", "&amp;") in d: return d[k.replace("&", "&amp;")].replace("&amp;", "&")
            if k.replace("&amp;", "&") in d: return d[k.replace("&amp;", "&")].replace("&", "&amp;")
        return None
    return lookup

def build_page(name, cfg, mod, missing):
    lookup = make_lookup(mod.T)
    h = open(os.path.join(ROOT, name), encoding="utf-8").read()
    d = cfg["dir"]
    # 1) 언어 / 경로
    h = h.replace('<html lang="ko"', '<html lang="%s"' % cfg["html_lang"], 1)
    for a, b in [('href="css/', 'href="../css/'), ('src="js/', 'src="../js/'),
                 ('src="assets/', 'src="../assets/'), ('href="assets/', 'href="../assets/')]:
        h = h.replace(a, b)
    h = h.replace('../js/products-data.js', '../js/products-data-%s.js' % d)
    h = re.sub(r"<body([^>]*)>", lambda m: "<body" + m.group(1) + ' data-base="../">', h, count=1)
    # 2) 언어 선택 링크: KOR → ../X , 자기 언어 → X(현재) , 다른 언어 → ../다른언어/X
    h = re.sub(r'<a href="([^"]+)" aria-current="true" lang="ko">KOR</a>', r'<a href="../\1" lang="ko">KOR</a>', h)
    for other in ("en", "cn"):
        if other == d:
            h = re.sub(r'<a href="%s/([^"]+)" lang="([^"]+)">' % other, r'<a href="\1" aria-current="true" lang="\2">', h)
        else:
            h = h.replace('href="%s/' % other, 'href="../%s/' % other)
    # 3) 외부 링크·폼 값
    h = h.replace("https://orchem.com/home/main.php", cfg["corp"])
    h = h.replace('name="page_language" value="ko"', 'name="page_language" value="%s"' % d)
    # 4) 글자 번역 (주석은 건드리지 않음)
    parts = re.split(r"(<!--.*?-->)", h, flags=re.S)
    def tr_text(m):
        raw = m.group(1)
        if not MIXED.search(raw): return m.group(0)
        v = lookup(raw)
        if v is None:
            missing.add((name, norm(raw))); return m.group(0)
        lead = raw[:len(raw) - len(raw.lstrip())]; tail = raw[len(raw.rstrip()):]
        if cfg["zh"]:   # 중문은 줄바꿈이 아닌 공백(띄어쓰기)은 붙임
            lead = lead if "\n" in lead else ""; tail = tail if "\n" in tail else ""
        return ">" + lead + v + tail + "<"
    def tr_attr(m):
        raw = m.group(2)
        if not MIXED.search(raw): return m.group(0)
        v = lookup(raw)
        if v is None:
            missing.add((name, norm(raw))); return m.group(0)
        return m.group(1) + '="' + v.replace('"', "&quot;") + '"'
    for i, p in enumerate(parts):
        if p.startswith("<!--"): continue
        p = re.sub(r">([^<>]+)<", tr_text, p)
        p = re.sub(r'\b(alt|aria-label|title|placeholder|content|value)="([^"]*)"', tr_attr, p)
        parts[i] = p
    h = "".join(parts)
    # 5) 전화번호 국제 표기
    h = h.replace('href="tel:031-488-0600"', 'href="tel:+82-31-488-0600"')
    h = h.replace("031-488-0600", "+82-31-488-0600").replace("031-488-0660", "+82-31-488-0660")
    h = h.replace("+82-+82-", "+82-")
    for a, b in getattr(mod, "POST", {}).get(name, []):
        h = h.replace(a, b)
    out = os.path.join(ROOT, d, name)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(h)

def build_data(cfg, mod, missing):
    lookup = make_lookup(mod.T)
    src = open(os.path.join(ROOT, "js", "products-data.js"), encoding="utf-8").read()
    head, body = src.split("window.ORC_PROCESS", 1)
    def tr(m):
        s = m.group(1)
        if not MIXED.search(s): return m.group(0)
        v = lookup(s, getattr(mod, "DATA_ONLY", {}))
        if v is None:
            missing.add(("products-data.js", s)); return m.group(0)
        return "'" + v.replace("&amp;", "&").replace("'", "\\'") + "'"
    out_lines = []
    for line in body.split("\n"):
        code, sep, cmt = line.partition("/*")
        code = re.sub(r"'((?:[^'\\]|\\.)*)'", tr, code)
        out_lines.append(code + sep + cmt)
    body = "\n".join(out_lines)
    hdr = "/* ORCHEM product data — %s (generated by _tools/build_en.py from js/products-data.js. Do not edit by hand.) */\n" % cfg["label"]
    open(os.path.join(ROOT, "js", "products-data-%s.js" % cfg["dir"]), "w", encoding="utf-8").write(hdr + "window.ORC_PROCESS" + body)

def build(lang):
    cfg = LANGS[lang]
    mod = importlib.import_module("translations_%s" % lang)
    missing = set()
    for p in PAGES: build_page(p, cfg, mod, missing)
    build_data(cfg, mod, missing)
    if missing:
        print("[%s] 번역표에 없는 한글 %d개:" % (lang, len(missing)))
        for f, s in sorted(missing): print("  [%s] %s" % (f, s))
    else:
        print("[%s] OK - %s/ 6페이지와 js/products-data-%s.js 생성 완료 (남은 한글 없음)" % (lang, cfg["dir"], cfg["dir"]))

for lang in (sys.argv[1:] or ["en", "cn"]):
    build(lang)
