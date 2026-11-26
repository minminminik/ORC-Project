# 메인 히어로 슬라이드 2 그림(반도체 패키지 · PCB 3D 입체도) 생성기
# 사용: python _tools/gen_hero3d.py  → index.html 의 <svg class="pcb-svg ..."> 를 교체
# 그 뒤 python _tools/build_en.py 로 영문·중문 재생성
AX, AY = 0.86, 0.20   # X축(오른쪽 아래)
BX, BY = 0.52, -0.30  # Y축(깊이: 오른쪽 위)
OX, OY = 40, 300

def P(x, y, z):
    return (OX + x * AX + y * BX, OY + x * AY + y * BY - z)

def pts(*ps):
    return ' '.join('%.1f,%.1f' % P(*p) for p in ps)

out = []
def poly(points, fill, stroke='none', extra=''):
    out.append('<polygon points="%s" fill="%s"%s%s/>' % (points, fill, (' stroke="%s"' % stroke) if stroke != 'none' else '', extra))

def box(x0, x1, y0, y1, z0, z1, top, front, side, stroke='rgba(255,255,255,.35)', sw=1):
    e = ' stroke-width="%s" stroke-linejoin="round"' % sw
    poly(pts((x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)), side, stroke, e)
    poly(pts((x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)), front, stroke, e)
    poly(pts((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)), top, stroke, e)

def front_rect(x0, x1, z0, z1, fill, y=0, extra=''):
    poly(pts((x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1)), fill, extra=extra)

def top_rect(x0, x1, y0, y1, z, fill, extra=''):
    poly(pts((x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)), fill, extra=extra)

def ball(x, y, z, r, grad):
    cx, cy = P(x, y, z)
    out.append('<circle cx="%.1f" cy="%.1f" r="%s" fill="url(#%s)"/>' % (cx, cy, r, grad))

# ---------------- PCB ----------------
PX0, PX1, PY0, PY1, PZ0, PZ1 = 0, 560, 0, 190, 0, 62
# 바닥 그림자
sx = [P(PX0, PY0, -6), P(PX1, PY0, -6), P(PX1, PY1, -6), P(PX0, PY1, -6)]
out.append('<polygon points="%s" fill="#001E22" opacity=".55" filter="url(#p3Blur)"/>' % ' '.join('%.1f,%.1f' % (a, b + 14) for a, b in sx))
box(PX0, PX1, PY0, PY1, PZ0, PZ1, 'url(#p3PcbTop)', 'url(#p3PcbFront)', '#0E4B52')
# 단면: 적층 밴드(프리프레그/코어 교차)
for i, (z0, z1) in enumerate([(0, 12), (12, 25), (25, 37), (37, 50), (50, 62)]):
    if i % 2: front_rect(PX0, PX1, z0, z1, 'rgba(255,255,255,.07)')
# 단면 내층 동박
for z, segs in [(12, [(20, 120), (190, 270), (330, 400), (440, 540)]), (25, [(60, 150), (230, 290), (360, 430), (470, 530)]),
                (37, [(30, 110), (200, 260), (310, 390), (450, 520)]), (50, [(70, 140), (215, 300), (340, 420), (480, 545)])]:
    for a, b in segs:
        front_rect(a, b, z - 1.5, z + 1.5, '#1EB5BC', extra=' opacity=".9"')
# 단면 비아(동도금 기둥)
for vx, op in [(170, 1), (296, .8), (410, 1)]:
    front_rect(vx - 5, vx + 5, 0, PZ1, '#1EB5BC', extra=' opacity="%s"' % op)
    front_rect(vx - 2, vx + 2, 0, PZ1, '#7FEFF3', extra=' opacity=".55"')
    front_rect(vx - 13, vx + 13, PZ1 - 3, PZ1, '#1EB5BC')
    front_rect(vx - 13, vx + 13, 0, 3, '#1EB5BC')
# 우측 끝 표면 동박 패드 (Etchant & Cleaner)
front_rect(520, 552, 22, 30, '#1EB5BC')
# 상면 회로 패턴
trace = 'stroke="#1EB5BC" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round" stroke-linejoin="round"'
def tline(*ps):
    out.append('<polyline points="%s" %s/>' % (pts(*[(x, y, PZ1) for x, y in ps]), trace))
tline((20, 30), (90, 30), (110, 60), (110, 160))
tline((20, 70), (60, 70), (80, 100), (80, 175))
tline((470, 20), (470, 60), (500, 90), (545, 90))
tline((450, 120), (520, 120), (540, 150))
tline((30, 120), (50, 140), (50, 178))
tline((500, 160), (545, 160))
for x, y in [(110, 160), (80, 175), (545, 90), (540, 150), (50, 178), (545, 160), (20, 30), (20, 70)]:
    cx, cy = P(x, y, PZ1)
    out.append('<ellipse cx="%.1f" cy="%.1f" rx="4.5" ry="2.6" fill="#0A3B41" stroke="#1EB5BC" stroke-width="1.5"/>' % (cx, cy))
# 상면 비아 패드
for vx in [170, 296, 410]:
    top_rect(vx - 13, vx + 13, 0, 14, PZ1, '#1EB5BC')

# ---------------- 솔더볼 ----------------
KX0, KX1, KY0, KY1 = 135, 435, 30, 160
BZ = PZ1 + 8
for by in [148, 115, 82, 49]:
    for bx in range(152, 430, 33):
        top_rect(bx - 6, bx + 6, by - 6, by + 6, PZ1, '#1EB5BC', ' opacity=".7"')
        ball(bx, by, BZ, 8, 'p3Ball')

# ---------------- PKG 기판 (Glass Core) ----------------
KZ0, KZ1 = PZ1 + 16, PZ1 + 66
box(KX0, KX1, KY0, KY1, KZ0, KZ1, 'url(#p3CoreTop)', 'url(#p3CoreFront)', '#0F5D63', '#1EB5BC', 1.2)
front_rect(KX0, KX1, KZ0, KZ0 + 8, 'rgba(255,255,255,.16)', y=KY0)
front_rect(KX0, KX1, KZ1 - 8, KZ1, 'rgba(255,255,255,.16)', y=KY0)
for gx in range(152, 430, 32):  # TGV (모래시계 모양 유리 관통 비아)
    zA, zB, zM = KZ0 + 8, KZ1 - 8, (KZ0 + KZ1) / 2
    poly(pts((gx - 6, KY0, zB), (gx + 6, KY0, zB), (gx + 2.5, KY0, zM), (gx + 6, KY0, zA), (gx - 6, KY0, zA), (gx - 2.5, KY0, zM)), '#1EB5BC')

# ---------------- 인터포저 ----------------
IZ0, IZ1 = KZ1 + 7, KZ1 + 23
for ix0, ix1 in [(150, 285), (300, 425)]:
    for bx in range(ix0 + 12, ix1 - 4, 18):  # 인터포저 아래 범프
        ball(bx, 52, KZ1 + 3.5, 3.2, 'p3Ball')
gi = (150, 285); si = (300, 425)
box(gi[0], gi[1], 50, 140, IZ0, IZ1, '#3AA9AF', '#1E8C93', '#156E74', '#7FEFF3', 1)
for x in range(170, 285, 28):
    front_rect(x, x + 3, IZ0, IZ1, '#7FEFF3', y=50, extra=' opacity=".8"')
box(si[0], si[1], 50, 140, IZ0, IZ1, '#6D9EA3', '#4E8388', '#3D6D72', 'rgba(255,255,255,.6)', 1)
for x in range(320, 425, 28):
    front_rect(x, x + 3, IZ0, IZ1, '#1EB5BC', y=50)

# ---------------- HBM 적층 / 반도체 칩 ----------------
HZ = IZ1 + 6
for bx in range(176, 268, 14):
    ball(bx, 72, IZ1 + 3, 2.6, 'p3Ball')
for bx in range(326, 412, 14):
    ball(bx, 72, IZ1 + 3, 2.6, 'p3Ball')
hx0, hx1, hy0, hy1 = 165, 270, 70, 125
for i in range(6):
    z0 = HZ + i * 12
    box(hx0, hx1, hy0, hy1, z0, z0 + 10, '#5E979C' if i == 5 else '#4F8A90', '#3E777D', '#2F6267', 'rgba(255,255,255,.55)', 1)
for x in (190, 217, 244):
    front_rect(x - 1.5, x + 1.5, HZ, HZ + 70, '#1EB5BC', y=hy0)
cx0, cx1, cy0, cy1 = 318, 412, 66, 128
box(cx0, cx1, cy0, cy1, HZ, HZ + 26, 'url(#p3ChipTop)', '#0B3F45', '#082F34', '#7FEFF3', 1.2)
for i in range(1, 6):
    a = P(cx0 + 10, cy0 + i * 10, HZ + 26); b = P(cx1 - 10, cy0 + i * 10, HZ + 26)
    out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="rgba(127,239,243,.3)"/>' % (a + b))

# ---------------- 라벨 ----------------
def label(text, x, y, anchor='middle', lead=None):
    if lead:
        out.append('<path class="pkg-lead" d="M%.1f %.1f L%.1f %.1f"/>' % lead)
    out.append('<text class="pkg-label" x="%.1f" y="%.1f" text-anchor="%s">%s</text>' % (x, y, anchor, text))

hx, hy = P((hx0 + hx1) / 2, (hy0 + hy1) / 2, HZ + 72)
label('HBM', hx, hy - 22)
cxm, cym = P((cx0 + cx1) / 2, (cy0 + cy1) / 2, HZ + 26)
label('SemiConductor', cxm + 40, cym - 46, lead=(cxm, cym - 4, cxm + 30, cym - 40))
a = P(gi[0], 50, (IZ0 + IZ1) / 2)
label('Glass Interposer', a[0] - 40, a[1] + 4, 'end', lead=(a[0] - 2, a[1], a[0] - 36, a[1]))
a = P(si[1], 95, (IZ0 + IZ1) / 2)
label('Silicon Interposer', a[0] + 30, a[1] + 4, 'start', lead=(a[0] + 2, a[1], a[0] + 26, a[1]))
a = P(KX1, (KY0 + KY1) / 2, (KZ0 + KZ1) / 2)
label('PKG (Glass Core)', a[0] + 30, a[1] + 4, 'start', lead=(a[0] + 2, a[1], a[0] + 26, a[1]))
a = P(280, 0, 0)
label('PCB', a[0], a[1] + 30)

# ---------------- 적용 부위 마커 ----------------
marks = [(1, P(0, 0, 31)), (2, P(170, 0, PZ1)), (3, P(410, 0, PZ1)), (4, P(170, 0, 0)), (5, P(552, 0, 26))]
m = ['<g class="pkg-markers">']
for i, (n, (x, y)) in enumerate(marks):
    d = (' style="animation-delay:%ss"' % (i * .5)) if i else ''
    m.append('<circle class="pkg-pulse" cx="%.1f" cy="%.1f" r="11"%s/><g class="pkg-marker"><circle cx="%.1f" cy="%.1f" r="11"/><text x="%.1f" y="%.1f">%d</text></g>' % (x, y, d, x, y, x, y + 4, n))
m.append('</g>')

defs = '''<defs>
              <linearGradient id="p3PcbTop" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1F7178"/><stop offset="1" stop-color="#2B8890"/></linearGradient>
              <linearGradient id="p3PcbFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#175F66"/><stop offset="1" stop-color="#114E55"/></linearGradient>
              <linearGradient id="p3CoreTop" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#2C9EA5"/><stop offset="1" stop-color="#4CC3C9"/></linearGradient>
              <linearGradient id="p3CoreFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A858C"/><stop offset="1" stop-color="#136A70"/></linearGradient>
              <linearGradient id="p3ChipTop" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0E4C53"/><stop offset="1" stop-color="#18686F"/></linearGradient>
              <radialGradient id="p3Ball" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#C9DFE1"/><stop offset="1" stop-color="#6E9599"/></radialGradient>
              <filter id="p3Blur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
            </defs>'''

body = '\n            '.join(out + m)
svg = ('<svg class="pcb-svg pcb-svg--3d" viewBox="24 62 624 372" xmlns="http://www.w3.org/2000/svg">\n            ' + defs +
       '\n            ' + body + '\n          </svg>')
import os
f = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'index.html')
h = open(f, encoding='utf-8').read()
i = h.index('<svg class="pcb-svg'); j = h.index('</svg>', i) + 6
open(f, 'w', encoding='utf-8', newline='').write(h[:i] + svg + h[j:])
print('index.html updated')
