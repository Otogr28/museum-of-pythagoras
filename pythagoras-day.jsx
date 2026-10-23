// Pythagoras Day 10/24/26 — about 21 s authored, 1920x1080, built on animations-v3.
const W = 1920, H = 1080;
const MOTION = {
  enter: Easing.easeOutCubic,
  draw: Easing.easeInOutCubic,
  pop: Easing.easeOutBack,
};
const cl = (v) => Math.max(0, Math.min(1, v));
const prog = (T, a, b) => cl((T - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
// projector framing: the whole stage at about 110%, drifting slowly so the screen never sits still
const STAGE = (T) => `perspective(2200px) rotateY(${2.4 * Math.sin(T / 11)}deg) rotateX(${1.4 * Math.sin(T / 15)}deg) translate(${10 * Math.sin(T / 9)}px, ${6 * Math.sin(T / 13)}px) scale(${1.08 + 0.01 * Math.sin(T / 7)})`;
// depth: everything reads as engraved into the navy ground and lit from within: a dark lip above, a faint light
// lip below, a glow in the element's own colour; cards and panels are pressed in, with a soft pink halo
// (matched on the inline font and card colour, so every scene picks it up without per-element styles)
const DEPTH_CSS = '.om3d [style*="Cormorant"]{font-weight:600;text-shadow:-1px -2px 0 rgba(6,9,22,.85),1px 1px 0 rgba(255,255,255,.14),0 0 18px currentColor}'
  // a glint of gold light travels across the display type; --sheen comes from the clock, --wo staggers it word by word
  + '.om3d [style*="Cormorant"]:not(:has(.om-w)):not([style*="text-shadow"]):not([style*="background"]),.om3d [style*="Cormorant"] .om-w{text-shadow:none;filter:drop-shadow(-1px -2px 0 rgba(6,9,22,.85)) drop-shadow(0 0 9px rgba(245,212,242,.45));background-image:linear-gradient(110deg,currentColor 42%,rgb(255,236,200) 50%,currentColor 58%);background-size:240% 100%;background-position:var(--sheen) 0;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}'
  + '.om3d [style*="Cormorant"] .om-w{background-position:calc(var(--sheen) + var(--wo)) 0}'
  + '.om3d [style*="Lora"]{font-weight:400;text-shadow:-1px -1px 0 rgba(6,9,22,.8),1px 1px 0 rgba(255,255,255,.1),0 0 12px rgba(245,212,242,.28)}'
  + '.om3d [style*="color: rgb(32, 43, 72)"]{text-shadow:1px 1px 0 rgba(255,255,255,.35)}' // navy labels set on the pink fills
  + '.om3d svg{filter:drop-shadow(-1px -2px 0 rgba(6,9,22,.8)) drop-shadow(1px 1px 0 rgba(255,255,255,.12)) drop-shadow(0 0 10px rgba(245,212,242,.45))}'
  + '.om3d img{box-shadow:inset 0 0 0 1px rgba(6,9,22,.8),0 0 0 1px rgba(255,255,255,.08),0 0 28px rgba(245,212,242,.22)}'
  + '.om3d [style*="background: rgb(38, 50, 79)"]{position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),inset 0 0 44px rgba(225,173,102,.42),inset 8px 10px 22px rgba(6,9,22,.6),0 0 0 1px rgba(6,9,22,.6),0 0 26px rgba(245,212,242,.32)}'
  // a 2 px metal rim in the palette's purples; its glint travels with --sheen
  + '.om3d [style*="background: rgb(38, 50, 79)"]::before{content:"";position:absolute;inset:0;z-index:1;border-radius:inherit;padding:2px;pointer-events:none;background:linear-gradient(115deg,#857a9e 0%,#f5d4f2 22%,#ffffff 30%,#b5b0ab 42%,#f5d4f2 60%,#857a9e 78%,#f5d4f2 100%);background-size:220% 100%;background-position:var(--sheen) 0;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}';
// background: faint figures (triangles, squares, circles, the squares-on-the-sides figure) and numbers drifting at three depths, behind every scene. It runs on the
// global clock (time), so in the full loop it flows on unbroken from one part into the next.
const BG_GLYPHS = ['3', '4', '5', '12', '13', '√2', 'a²', 'b²', 'c²', '25', '169', '90°', '8 · 15 · 17', 'a² + b² = c²',
  '7', '24', '26', '10', '17', '√3', '√5', '676', '100', '576', '3² + 4² = 5²', '1.414', '5 · 12 · 13', '60'];
const BG_ITEMS = (() => {
  let s = 7;
  const r = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  return Array.from({ length: 76 }, (_, i) => {
    const depth = [0.45, 0.7, 1][i % 3];
    return { kind: [0, 2, 1, 2, 3, 4, 2, 0, 3, 2, 1, 2, 4, 0, 2, 3, 1, 2][i % 18], x: r() * 2320, y: r() * 1280, size: (50 + r() * 110) * depth, vx: (7 + r() * 10) * depth,
      vy: (r() - 0.5) * 6 * depth, rot: r() * 360, spin: (r() - 0.5) * 10 * depth, txt: BG_GLYPHS[i % BG_GLYPHS.length], hot: r() < 0.35, depth };
  });
})();
function Field({ time, ink, accent }) {
  const place = (it) => [((it.x + it.vx * time) % 2320) - 200, (((it.y + it.vy * time) % 1280) + 1280) % 1280 - 100];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(-1px -1px 0 rgba(6,9,22,.7)) drop-shadow(1px 1px 0 rgba(255,255,255,.08)) drop-shadow(0 0 6px rgba(245,212,242,.3))' }} aria-hidden="true">
        {BG_ITEMS.filter((it) => it.kind !== 2).map((it, i) => {
          const [x, y] = place(it), u = it.size / 5, c = it.hot ? accent : ink;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${it.rot + it.spin * time})`} opacity={(it.hot ? 0.12 : 0.1) * it.depth}>
              {it.kind === 0 && <polygon points={`0,0 ${4 * u},0 0,${-3 * u}`} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />}
              {it.kind === 1 && <rect x={-it.size / 2} y={-it.size / 2} width={it.size} height={it.size} fill="none" stroke={c} strokeWidth="2" />}
              {it.kind === 3 && <circle r={it.size / 2} fill="none" stroke={c} strokeWidth="2" />}
              {it.kind === 4 && (
                <g fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round">
                  <polygon points={`0,0 ${4 * u * 0.6},0 0,${-3 * u * 0.6}`} />
                  <rect x="0" y="0" width={4 * u * 0.6} height={4 * u * 0.6} />
                  <rect x={-3 * u * 0.6} y={-3 * u * 0.6} width={3 * u * 0.6} height={3 * u * 0.6} />
                  <polygon points={`${4 * u * 0.6},0 0,${-3 * u * 0.6} ${3 * u * 0.6},${-7 * u * 0.6} ${7 * u * 0.6},${-4 * u * 0.6}`} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {BG_ITEMS.filter((it) => it.kind === 2).map((it, i) => {
        const [x, y] = place(it);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${(it.rot + it.spin * time) * 0.15}deg)`, opacity: 0.09 * it.depth,
            fontFamily: SERIF, fontWeight: 400, fontSize: it.size * 0.7, lineHeight: 1, whiteSpace: 'nowrap', textShadow: '-1px -1px 0 rgba(6,9,22,.7), 1px 1px 0 rgba(255,255,255,.08), 0 0 10px currentColor', color: it.hot ? accent : ink }}>{it.txt}</div>
        );
      })}
    </div>
  );
}
// text arrives a word at a time, each on its own slightly irregular beat (fixed per word, so every loop matches)
function Words({ p, children }) {
  if (typeof children !== 'string') return <span style={{ opacity: p }}>{children}</span>;
  const w = children.trim().split(/\s+/), n = w.length, S = Math.min(2.2, 0.4 + n * 0.12);
  return w.map((word, i) => {
    const jit = ((i * 7919) % 11) / 11;
    const d = n > 1 ? (i / (n - 1)) * S * 0.75 + jit * S * 0.25 : 0;
    const e = MOTION.enter(cl(p * (1 + S) - d));
    return <span key={i} className="om-w" style={{ '--wo': `${(i / n) * 50}%`, display: 'inline-block', whiteSpace: 'pre', opacity: e, transform: `translateY(${16 * (1 - e)}px) rotateX(${-55 * (1 - e)}deg)`,
      filter: e < 1 ? `blur(${5 * (1 - e)}px)` : undefined }}>{i < n - 1 ? word + ' ' : word}</span>;
  });
}
// piecewise keyframes [[t, v], ...] with one of the MOTION curves
function kf(T, keys, ease = MOTION.draw) {
  if (T <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i], [t0, v0] = keys[i - 1];
    if (T <= t1) return lerp(v0, v1, ease(prog(T, t0, t1)));
  }
  return keys[keys.length - 1][1];
}

const PALETTES = {
  Series: {
    a: { s: '#a49cc8', f: '#5f6080' },
    b: { s: '#f5d4f2', f: '#c9a3c6' },
    c: { s: '#b5b0ab', f: '#857a9e' },
  },
  Mono: {
    a: { s: '#b5b0ab', f: '#5f6080' },
    b: { s: '#f5d4f2', f: '#857a9e' },
    c: { s: '#f5d4f2', f: '#857a9e' },
  },
};
const INK = '#f2eef0', MUTED = '#b5b0ab', GOLD = '#f5d4f2', GOLD_DEEP = '#f5d4f2', HAIR = 'rgba(181,176,171,0.35)', BG = '#202b48', CARD = '#26324f', NAVY_INK = '#202b48';
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif';

// ---- geometry (world units; y up) ----
const U = 16, OX = 320, OY = 624;
const sx = (x) => OX + x * U, sy = (y) => OY - y * U;
const E1 = [24 / 26, -10 / 26], E2 = [10 / 26, 24 / 26], P0 = [0, 10];
const ROT = Math.atan2(10, 24) * 180 / Math.PI; // screen-space rotation of c-square
const cPt = (c, r) => [P0[0] + c * E1[0] + r * E2[0], P0[1] + c * E1[1] + r * E2[1]];

const TILES = (() => {
  const src = [];
  for (let row = 9; row >= 0; row--) for (let col = 9; col >= 0; col--)
    src.push({ k: 'a', x: -10 + col + 0.5, y: row + 0.5, i: row * 10 + col });
  for (let row = 0; row < 24; row++) for (let col = 23; col >= 0; col--)
    src.push({ k: 'b', x: col + 0.5, y: -row - 0.5, i: row * 24 + col });
  return src.map((s, j) => {
    const r = 25 - Math.floor(j / 26), c = j % 26;
    const [dx, dy] = cPt(c + 0.5, r + 0.5);
    const mx = (s.x + dx) / 2 + E2[0] * 7, my = (s.y + dy) / 2 + E2[1] * 7;
    return { ...s, j, dx, dy, mx, my };
  });
})();
const POUR0 = 7.2, POUR_SPREAD = 3.9, POUR_DUR = 0.85;

function Figure({ T, C, pal }) {
  const fig = 1 - prog(T, C.Flip, C.Flip + 0.7);
  if (fig <= 0) return null;
  const drift = kf(T, [[C.Triangle, 0.97], [C.Flip, 1.03]], Easing.linear);
  const shift = kf(T, [[C.Flip, 0], [C.Flip + 0.7, -140]], MOTION.enter);
  const tri = prog(T, C.Triangle + 0.8, C.Triangle + 1.8);
  const triLen = 60 * U;
  const cOut = prog(T, C.Triangle + 3.2, C.Triangle + 3.9);
  const cCorners = [cPt(0, 0), cPt(26, 0), cPt(26, 26), cPt(0, 26)].map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');
  const tiles = TILES.map((t) => {
    const appear = t.k === 'a'
      ? prog(T, C.Triangle + 1.6 + (t.i / 100) * 0.8, C.Triangle + 1.6 + (t.i / 100) * 0.8 + 0.35)
      : prog(T, C.Triangle + 2.0 + (t.i / 576) * 1.2, C.Triangle + 2.0 + (t.i / 576) * 1.2 + 0.35);
    if (appear <= 0) return null;
    const st = POUR0 + (t.j / 675) * POUR_SPREAD;
    const p = MOTION.draw(prog(T, st, st + POUR_DUR));
    const q = 1 - p;
    const x = q * q * t.x + 2 * q * p * t.mx + p * p * t.dx;
    const y = q * q * t.y + 2 * q * p * t.my + p * p * t.dy;
    const cx = sx(x), cy = sy(y), s = (U - 2) * MOTION.pop(appear);
    const col = pal[t.k];
    return (
      <rect key={t.j} x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx="1.5"
        fill={col.f} stroke={col.s} strokeWidth="1"
        transform={`rotate(${ROT * p} ${cx} ${cy})`} />
    );
  });
  const label = (txt, x, y, o, color) => o > 0 && (
    <div style={{ position: 'absolute', left: sx(x), top: sy(y), transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * o})`,
      opacity: o, fontFamily: SERIF, fontSize: 64, color: GOLD, background: BG, padding: '6px 18px 10px', borderRadius: 4, fontFeatureSettings: '"tnum"', lineHeight: 1 }}>{txt}</div>
  );
  const aL = prog(T, C.Triangle + 2.5, C.Triangle + 2.9) * (1 - prog(T, POUR0, POUR0 + 0.4));
  const bL = prog(T, C.Triangle + 3.3, C.Triangle + 3.7) * (1 - prog(T, POUR0 + 0.9, POUR0 + 1.4));
  const cL = prog(T, POUR0 + POUR_SPREAD + POUR_DUR, POUR0 + POUR_SPREAD + POUR_DUR + 0.4);
  const [ccx, ccy] = cPt(13, 13);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fig,
      transform: `translateX(${shift}px) scale(${drift})`, transformOrigin: '512px 544px' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <polygon points={cCorners} fill="none" stroke={pal.c.s} strokeWidth="2"
          strokeDasharray={104 * U} strokeDashoffset={104 * U * (1 - MOTION.draw(cOut))} />
        {tiles}
        <polygon points={`${sx(0)},${sy(0)} ${sx(0)},${sy(10)} ${sx(24)},${sy(0)}`} fill="none" stroke={INK} strokeWidth="3"
          strokeLinejoin="round" strokeDasharray={triLen} strokeDashoffset={triLen * (1 - MOTION.draw(tri))} />
        <polyline points={`${sx(0)},${sy(1.2)} ${sx(1.2)},${sy(1.2)} ${sx(1.2)},${sy(0)}`} fill="none" stroke={INK}
          strokeWidth="1.5" opacity={prog(T, C.Triangle + 1.6, C.Triangle + 2)} />
      </svg>
      {label('100', -5, 5, aL, INK)}
      {label('576', 12, -12, bL, INK)}
      {label('676', ccx, ccy, cL, INK)}
    </div>
  );
}

function pseudoDate(y) {
  return [String(((y * 7) % 12) + 1), String(((y * 13) % 28) + 1), String(y % 100).padStart(2, '0')];
}

function countdown(nowMs) {
  const target = new Date(2105, 2, 4, 0, 0, 0);
  let d = new Date(nowMs);
  if (d >= target) return null;
  let y = 0, m = 0;
  const add = (dt, yy, mm) => { const n = new Date(dt); n.setFullYear(n.getFullYear() + yy, n.getMonth() + mm); return n; };
  while (add(d, y + 1, 0) <= target) y++;
  while (add(d, y, m + 1) <= target) m++;
  let rest = target - add(d, y, m);
  const days = Math.floor(rest / 864e5); rest -= days * 864e5;
  const h = Math.floor(rest / 36e5); rest -= h * 36e5;
  const mi = Math.floor(rest / 6e4); rest -= mi * 6e4;
  const s = Math.floor(rest / 1e3);
  return { y, m, days, h, mi, s };
}

function DateAndEquation({ T, C, pal, showSeconds, baseNow }) {
  // three numeral slots — the date numbers become the equation's bases, then the flipping calendar
  const EQ = C.Triangle + 0.2, EQ_END = C.Triangle + 1.4;
  const BACK = C.Flip + 0.2, BACK_END = C.Flip + 1.2;
  const FLIP0 = C.Flip + 1.3, FLIP1 = C.Countdown - 0.4;
  const dateY = 540, cardY = 520;
  const slotX = [[620, 1140, 690], [960, 1410, 960], [1300, 1680, 1250]];
  const slotTxt = (i) => {
    if (T < FLIP0) return ['10', '24', '26'][i];
    if (T < FLIP1) {
      const yr = Math.round(2026 + 79 * MOTION.draw(prog(T, FLIP0, FLIP1)));
      return yr >= 2105 ? ['3', '4', '05'][i] : pseudoDate(yr)[i];
    }
    return ['3', '4', '05'][i];
  };
  const landed = prog(T, FLIP1, FLIP1 + 0.5);
  // card row laid out from glyph widths (Cormorant tnum digits ≈ 0.5em)
  const txts = [0, 1, 2].map(slotTxt);
  const dw = (t) => t.length * 0.55 * 200, SW = 60, GAP = 50;
  const totalW = dw(txts[0]) + dw(txts[1]) + dw(txts[2]) + 2 * SW + 4 * GAP;
  const L = []; let cx = 960 - totalW / 2;
  L[0] = cx + dw(txts[0]) / 2; cx += dw(txts[0]) + GAP;
  L[3] = cx + SW / 2; cx += SW + GAP;
  L[1] = cx + dw(txts[1]) / 2; cx += dw(txts[1]) + GAP;
  L[4] = cx + SW / 2; cx += SW + GAP;
  L[2] = cx + dw(txts[2]) / 2;
  const slots = [0, 1, 2].map((i) => {
    const enter = prog(T, 0.2 + i * 0.25, 1.1 + i * 0.25);
    const x = T >= BACK_END ? L[i] : kf(T, [[EQ, slotX[i][0]], [EQ_END, slotX[i][1]], [BACK, slotX[i][1]], [BACK_END, L[i]]]);
    const y = kf(T, [[EQ, dateY], [EQ_END, 330], [BACK, 330], [BACK_END, cardY]]);
    const size = kf(T, [[EQ, 260], [EQ_END, 130], [BACK, 130], [BACK_END, 200]]);
    const popS = T >= FLIP1 ? 1 + 0.08 * Math.sin(Math.PI * landed) : 1;
    const color = T >= FLIP1 ? GOLD : [pal.a.s, pal.b.s, pal.c.s][i];
    const tint = prog(T, EQ, EQ_END) * (1 - prog(T, BACK, BACK_END));
    return (
      <div key={i} style={{ position: 'absolute', left: x, top: y + 40 * (1 - MOTION.enter(enter)),
        transform: `translate(-50%,-50%) scale(${popS})`, opacity: MOTION.enter(enter),
        fontFamily: SERIF, fontSize: size, lineHeight: 1, fontFeatureSettings: '"tnum"',
        color: T >= FLIP1 ? GOLD : (tint > 0.5 ? color : INK), whiteSpace: 'nowrap' }}>{slotTxt(i)}</div>
    );
  });
  const glyph = (txt, x, y, size, o, color = MUTED) => o > 0 && (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o,
      fontFamily: SERIF, fontSize: size, lineHeight: 1, color, fontFeatureSettings: '"tnum"', whiteSpace: 'nowrap' }}>{txt}</div>
  );
  const slashDate = prog(T, 0.9, 1.5) * (1 - prog(T, EQ, EQ + 0.4));
  const slashCard = prog(T, BACK_END - 0.3, BACK_END);
  const ops = prog(T, EQ_END - 0.3, EQ_END + 0.2) * (1 - prog(T, C.Flip, C.Flip + 0.4));
  const sq = MOTION.pop(prog(T, EQ_END, EQ_END + 0.5));
  const row2 = (t0) => prog(T, t0, t0 + 0.4) * (1 - prog(T, C.Flip, C.Flip + 0.4));
  const landedN = Math.max(0, Math.min(676, Math.floor(((T - POUR0 - POUR_DUR) / POUR_SPREAD) * 675) + 1));
  const total = T > POUR0 + POUR_DUR ? String(landedN) : '?';
  const done = T >= POUR0 + POUR_SPREAD + POUR_DUR;
  const kick = prog(T, 0.6, 1.4) * (1 - prog(T, C.Triangle, C.Triangle + 0.5));
  const card = prog(T, BACK, BACK_END);
  const year = Math.round(2026 + 79 * MOTION.draw(prog(T, FLIP0, FLIP1)));
  const yearO = prog(T, FLIP0 - 0.3, FLIP0) * (1 - prog(T, C.Countdown, C.Countdown + 0.4));
  const head = prog(T, C.Countdown + 0.1, C.Countdown + 0.9);
  const cd = countdown(baseNow + T * 1000);
  const cdO = prog(T, C.Countdown + 0.8, C.Countdown + 1.6);
  const units = cd ? [[cd.y, 'years'], [cd.m, 'months'], [cd.days, 'days'], [cd.h, 'hours'], [cd.mi, 'minutes']]
    .concat(showSeconds ? [[cd.s, 'seconds']] : []) : [];
  return (
    <React.Fragment>
      {/* opening kicker */}
      {kick > 0 && (
        <React.Fragment>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: (kick) > 0 ? 1 : 0,
            fontFamily: BODY, fontSize: 30, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD_DEEP }}><Words p={kick}>{"Saturday · October 24 · 2026"}</Words></div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', opacity: (kick) > 0 ? 1 : 0,
            fontFamily: SERIF, fontStyle: 'italic', fontSize: 52, color: INK }}><Words p={kick}>{"The last Pythagorean Theorem Day of the century"}</Words></div>
          <div style={{ position: 'absolute', left: 860, width: 200 * MOTION.draw(kick), top: 820, height: 1, background: GOLD }}></div>
        </React.Fragment>
      )}
      {/* flip card */}
      {card > 0 && (
        <div style={{ position: 'absolute', left: 960, top: cardY, width: 1160, height: 400,
          transform: `translate(-50%,-50%) scale(${0.96 + 0.04 * MOTION.enter(card)})`, opacity: card,
          border: `1px solid ${HAIR}`, borderRadius: 4, background: CARD, boxShadow: 'none' }}>
        </div>
      )}
      {glyph('/', 790, dateY, 200, slashDate, '#857a9e')}
      {glyph('/', 1130, dateY, 200, slashDate, '#857a9e')}
      {glyph('/', L[3], cardY, 170, slashCard, '#857a9e')}
      {glyph('/', L[4], cardY, 170, slashCard, '#857a9e')}
      {slots}
      {/* equation operators + squares */}
      {/* exponents sit on each numeral's own ink: old-style 1, 0, 2 and 4 are short, the 6 rises */}
      {glyph('²', 1140 + 60, 326, 64, sq * ops, pal.a.s)}
      {glyph('²', 1410 + 62, 326, 64, sq * ops, pal.b.s)}
      {glyph('²', 1680 + 66, 312, 64, sq * ops, pal.c.s)}
      {glyph('+', 1275, 335, 100, ops)}
      {glyph('=', 1545, 335, 100, ops)}
      {/* row 2: areas */}
      {glyph('100', 1140, 500, 92, row2(C.Triangle + 2.5), pal.a.s)}
      {glyph('+', 1275, 500, 72, row2(C.Triangle + 3.0))}
      {glyph('576', 1410, 500, 92, row2(C.Triangle + 3.3), pal.b.s)}
      {glyph('=', 1545, 500, 72, row2(C.Triangle + 3.6))}
      {glyph(total, 1680, 500, 92, row2(C.Triangle + 3.6), done ? pal.c.s : MUTED)}
      {glyph('tiles', 1680, 570, 26, row2(POUR0 + 0.6) * (1 - prog(T, POUR0 + POUR_SPREAD, POUR0 + POUR_SPREAD + 0.5)), MUTED)}
      {done && glyph('10² + 24² = 26²', 1410, 640, 40, row2(POUR0 + POUR_SPREAD + POUR_DUR + 0.2), GOLD_DEEP)}
      {/* year ticker */}
      {yearO > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: yearO,
          fontFamily: BODY, fontSize: 40, letterSpacing: '0.18em', color: GOLD_DEEP, fontFeatureSettings: '"tnum"' }}>{year}</div>
      )}
      {glyph('March 4, 2105  ·  3² + 4² = 5²', 960, 780, 46, prog(T, FLIP1 + 0.2, FLIP1 + 0.7), INK)}
      {/* closing */}
      {head > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120 + 20 * (1 - MOTION.enter(head)), textAlign: 'center',
          opacity: (head) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 72, color: INK, lineHeight: 1.05 }}><Words p={head}>{"No date from 2027 to 2104 forms a Pythagorean triple."}</Words></div>
      )}
      {cdO > 0 && cd && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', gap: 56, opacity: cdO }}>
          {units.map(([v, l], i) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              opacity: prog(T, C.Countdown + 0.8 + i * 0.12, C.Countdown + 1.3 + i * 0.12) }}>
              <div style={{ fontFamily: SERIF, fontSize: 72, lineHeight: 1, color: INK, fontFeatureSettings: '"tnum"' }}>
                {i >= 3 ? String(v).padStart(2, '0') : v}</div>
              <div style={{ fontFamily: BODY, fontSize: 20, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>{l}</div>
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
}

function PythagorasPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const endFade = 1 - prog(T, (authoredTotal || 21) - 0.7, (authoredTotal || 21) - 0.05);
  // wall clock at T = 0, re-read each time the loop restarts so the countdown stays current
  const clock = React.useRef(null);
  if (!clock.current || T < clock.current.T - 1) clock.current = { base: Date.now() - T * 1000, T };
  clock.current.T = T;
  const baseNow = clock.current.base;
  const pal = PALETTES[tweaks.palette] || PALETTES.Series;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={MUTED} accent={GOLD} />
      <div style={{ position: 'absolute', inset: 0, opacity: endFade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Figure T={T} C={CUES} pal={pal} />
        <DateAndEquation T={T} C={CUES} pal={pal} showSeconds={tweaks.showSeconds} baseNow={baseNow} />
      </div>
    </div>
  );
}

function PythagorasDayApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, palette: 'Series', showSeconds: true });
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={BG} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <PythagorasPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Square colors" value={t.palette} options={['Series', 'Mono']} onChange={(v) => setTweak('palette', v)} />
        <TweakToggle label="Countdown seconds" value={t.showSeconds} onChange={(v) => setTweak('showSeconds', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.PythagorasDayApp = PythagorasDayApp;
