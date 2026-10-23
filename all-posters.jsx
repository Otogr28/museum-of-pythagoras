// All seven museum animations in one composition. Generated from the individual piece files.
function makeUse(prefix, firstName, total) {
  return function () {
    const c = window.useComposition();
    const off = c.CUES[prefix + firstName];
    const CUES = new Proxy({}, { get: (_, k) => c.CUES[prefix + String(k)] - off });
    return { ...c, T: c.T - off, CUES, authoredTotal: total };
  };
}
const PIECES = [];

PIECES.push({ prefix: "I ", first: "Date", total: 21, Piece: (function (useComposition) {
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

return PythagorasPiece;
})(makeUse("I ", "Date", 21)) });

PIECES.push({ prefix: "II ", first: "Open", total: 20, Piece: (function (useComposition) {
// History — "Pythagoras did not invent it." 20s, 1920x1080, animations-v3.
const W = 1920, H = 1080;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
const cl = (v) => Math.max(0, Math.min(1, v));
const prog = (T, a, b) => cl((T - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
// projector framing: the timeline already runs edge to edge, so this part only drifts
const STAGE = (T) => `perspective(2200px) rotateY(${2.4 * Math.sin(T / 11)}deg) rotateX(${1.4 * Math.sin(T / 15)}deg) translate(${10 * Math.sin(T / 9)}px, ${6 * Math.sin(T / 13)}px) scale(${0.98 + 0.01 * Math.sin(T / 7)})`;
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
function kf(T, keys, ease = MOTION.draw) {
  if (T <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i], [t0, v0] = keys[i - 1];
    if (T <= t1) return lerp(v0, v1, ease(prog(T, t0, t1)));
  }
  return keys[keys.length - 1][1];
}
const THEMES = {
  Museum: { bg: '#202b48', card: '#26324f', ink: '#f2eef0', muted: '#b5b0ab', faint: '#857a9e', gold: '#f5d4f2', goldText: '#f5d4f2', hair: 'rgba(181,176,171,0.35)', shadow: 'none' },
  Paper: { bg: '#f3f2f2', card: '#f8f6f5', ink: '#201f1d', muted: '#605d5d', faint: '#9b9797', gold: '#a06f24', goldText: '#7d5411', hair: 'rgba(32,31,29,0.18)', shadow: '0 3px 10px rgba(45,43,43,0.12)' },
  Colophon: { bg: '#1f1d1c', card: '#2a2827', ink: '#f3f2f2', muted: '#bab6b6', faint: '#7d7979', gold: '#e1ad66', goldText: '#e1ad66', hair: 'rgba(243,242,242,0.18)', shadow: '0 0 0 1px rgba(243,242,242,0.06)' },
};
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif';
const TNUM = '"tnum"';

// Plimpton 322, rows 1–5: short side and diagonal (on the tablet, base 60); long side computed
const ROWS = [
  { s60: '1,59', s: '119', d60: '2,49', d: '169', l: '120' },
  { s60: '56,7', s: '3,367', d60: '1,20,25', d: '4,825', l: '3,456' },
  { s60: '1,16,41', s: '4,601', d60: '1,50,49', d: '6,649', l: '4,800' },
  { s60: '3,31,49', s: '12,709', d60: '5,9,1', d: '18,541', l: '13,500' },
  { s60: '1,5', s: '65', d60: '1,37', d: '97', l: '72' },
];

const AX_Y = 610;
const yx = (yr) => 160 + ((yr + 1900) / 2200) * 1600;
const STOPS = [
  { place: 'Babylon', date: 'c. 1800 BC', what: 'Plimpton 322', img: 'images/plimpton-322.jpg', yr: -1800, up: true, at: 8.15 },
  { place: 'Egypt', date: 'c. 1800 BC', what: 'Berlin Papyrus 6619', yr: -1800, up: false, at: 9.3 },
  { place: 'India', date: '8th–5th c. BC', what: 'Baudhayana Shulba Sutra', yr: -650, up: false, at: 10.3, range: [-800, -500] },
  { place: 'Samos, Greece', date: 'c. 570 BC', what: 'Pythagoras is born', img: 'images/pythagoras-bust.jpg', pos: '50% 22%', yr: -570, up: true, at: 11.3, key: true },
  { place: 'Alexandria', date: 'c. 300 BC', what: 'Euclid, Elements I.47', img: 'images/euclid-oxyrhynchus.jpg', yr: -300, up: false, at: 12.9 },
  { place: 'China', date: 'c. 1st c. BC', what: 'Zhoubi Suanjing', img: 'images/zhoubi-gougu.jpg', pos: '70% 50%', yr: -100, up: true, at: 13.7 },
  { place: 'China', date: 'AD 263', what: 'Liu Hui’s dissection proof', yr: 263, up: false, at: 14.5 },
];
const plate = (th) => ({ filter: 'sepia(0.22) saturate(0.82) contrast(1.05)', boxSizing: 'border-box', border: `6px solid ${th.card}`, outline: `1px solid ${th.hair}`, objectFit: 'cover', display: 'block' });
const TICKS = [[-1500, '1500 BC'], [-1000, '1000 BC'], [-500, '500 BC'], [0, 'AD 1']];
// drawn check mark (neither display face has a ✓ glyph)
const Check = ({ color }) => (
  <svg width="44" height="44" viewBox="-5 -5 44 44" style={{ display: 'block', margin: '0 auto' }}>
    {/* a disc pressed into the card, the check lit inside it */}
    <circle cx="17" cy="17" r="20" fill="rgba(6,9,22,0.35)" stroke="rgba(245,212,242,0.22)" strokeWidth="1" />
    <polyline points="8,18 14.5,24.5 26,10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Tablet({ T, C, th }) {
  const inP = prog(T, C.Babylon + 0.1, C.Babylon + 0.9);
  const out = prog(T, C.Route - 1.0, C.Route - 0.15);
  if (inP <= 0 || out >= 1) return null;
  const s = MOTION.draw(out);
  const x = lerp(1200, yx(-1800), s), y = lerp(560, AX_Y - 54 - 153, s), sc = lerp(1, 0.24, s);
  const dec = (i) => prog(T, C.Babylon + 2.0 + i * 0.22, C.Babylon + 2.4 + i * 0.22);
  const longP = (i) => prog(T, C.Babylon + 3.3 + i * 0.12, C.Babylon + 3.7 + i * 0.12);
  const chk = prog(T, C.Babylon + 3.9, C.Babylon + 4.3);
  const rowIn = (i) => prog(T, C.Babylon + 0.5 + i * 0.12, C.Babylon + 0.9 + i * 0.12);
  // one base label at a time: the first leaves before the second arrives
  const base60 = 1 - prog(T, C.Babylon + 2.0, C.Babylon + 2.5), base10 = prog(T, C.Babylon + 2.5, C.Babylon + 3.0);
  const cell = (a, b, p, color) => (
    <div style={{ position: 'relative', height: 64, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 0, top: -30 * MOTION.draw(p), opacity: 1 - p, fontFamily: SERIF, fontSize: 52, lineHeight: '64px', color: th.muted, fontFeatureSettings: TNUM }}>{a}</div>
      <div style={{ position: 'absolute', right: 0, top: 30 * (1 - MOTION.draw(p)), opacity: p, fontFamily: SERIF, fontSize: 52, lineHeight: '64px', color, fontFeatureSettings: TNUM }}>{b}</div>
    </div>
  );
  const hdr = (t, o = 1) => <div style={{ textAlign: 'right', opacity: o, fontFamily: BODY, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.muted }}>{t}</div>;
  const ph = prog(T, C.Babylon + 0.3, C.Babylon + 1.1) * (1 - prog(T, C.Route - 1.3, C.Route - 0.8));
  return (
    <React.Fragment>
    {ph > 0 && (
      <div style={{ position: 'absolute', left: 150, top: 300, width: 470, opacity: ph, transform: `translateY(${24 * (1 - MOTION.enter(ph))}px) scale(${1 + 0.03 * prog(T, C.Babylon, C.Route)})`, transformOrigin: '50% 50%' }}>
        <img src="images/plimpton-322.jpg" style={{ ...plate(th), width: 470, height: 326 }} />
        <div style={{ marginTop: 14, fontFamily: BODY, fontStyle: 'italic', fontSize: 22, color: th.muted }}>The tablet, now at Columbia University</div>
      </div>
    )}
    <div style={{ position: 'absolute', left: x, top: y + 30 * (1 - MOTION.enter(inP)), width: 1000, height: 640,
      transform: `translate(-50%,-50%) scale(${sc})`, opacity: MOTION.enter(inP) * (1 - prog(T, C.Route - 0.3, C.Route - 0.1)),
      background: th.card, border: `1px solid ${th.hair}`, borderRadius: 4, boxShadow: th.shadow, padding: '48px 72px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${th.hair}`, paddingBottom: 20 }}>
        <div style={{ fontFamily: SERIF, fontSize: 56, color: th.ink, lineHeight: 1 }}>Plimpton 322</div>
        <div style={{ fontFamily: BODY, fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.goldText, fontFeatureSettings: TNUM }}>Babylon · c. 1800 BC</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 90px', columnGap: 48, rowGap: 4, marginTop: 28, alignItems: 'center' }}>
        {hdr('short side')}{hdr('diagonal')}{hdr('long side', longP(0))}<div></div>
        {ROWS.map((r, i) => (
          <React.Fragment key={i}>
            <div style={{ opacity: rowIn(i) }}>{cell(r.s60, r.s, dec(i), th.ink)}</div>
            <div style={{ opacity: rowIn(i) }}>{cell(r.d60, r.d, dec(i), th.ink)}</div>
            <div style={{ opacity: longP(i), textAlign: 'right', fontFamily: SERIF, fontSize: 52, lineHeight: '64px', color: th.gold, fontFeatureSettings: TNUM }}>{r.l}</div>
            <div style={{ opacity: chk, transform: `scale(${MOTION.pop(chk)})` }}><Check color={th.gold} /></div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 40, display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.muted }}>
        <div style={{ position: 'relative', width: 400, height: 28 }}>
          <div style={{ position: 'absolute', left: 0, opacity: base60 }}>Written in base 60</div>
          <div style={{ position: 'absolute', left: 0, opacity: base10 }}>Read in base 10</div>
        </div>
        <div style={{ opacity: chk, color: th.goldText, fontFeatureSettings: TNUM }}>a² + b² = c²  ·  rows 1–5 of 15</div>
      </div>
    </div>
    </React.Fragment>
  );
}

function StopCard({ T, C, th, st, i }) {
  const p = prog(T, st.at - 0.05, st.at + 0.4);
  if (p <= 0) return null;
  const x = yx(st.yr), imgH = st.img ? 150 : 0, cardH = 156 + imgH, gap = 54;
  const top = st.up ? AX_Y - gap - cardH : AX_Y + gap;
  const ring = prog(T, st.at, st.at + 0.9);
  const lineP = prog(T, st.at, st.at + 0.25);
  const accent = st.key ? th.gold : th.ink;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', left: x - 0.5, width: 1, top: st.up ? AX_Y - gap * lineP : AX_Y, height: gap * lineP, background: st.key ? th.gold : th.hair }}></div>
      {ring < 1 && <div style={{ position: 'absolute', left: x, top: AX_Y, width: 18 + 70 * MOTION.enter(ring), height: 18 + 70 * MOTION.enter(ring),
        transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `1.5px solid ${th.gold}`, opacity: 1 - ring }}></div>}
      <div style={{ position: 'absolute', left: x, top: AX_Y, width: 12, height: 12, transform: 'translate(-50%,-50%)', borderRadius: '50%',
        background: st.key ? th.gold : th.bg, border: `1.5px solid ${accent}` }}></div>
      <div style={{ position: 'absolute', left: x - 120, top, width: 240, height: cardH, boxSizing: 'border-box', padding: '16px 20px',
        background: th.card, border: `1px solid ${st.key ? th.gold : th.hair}`, borderRadius: 4, boxShadow: th.shadow,
        opacity: MOTION.enter(p), transform: `translateY(${(st.up ? 14 : -14) * (1 - MOTION.enter(p))}px) scale(${0.88 + 0.12 * MOTION.pop(p)})`,
        display: 'flex', flexDirection: 'column', gap: 6 }}>
        {st.img && <img src={st.img} style={{ ...plate(th), width: 'calc(100% + 28px)', margin: '-10px -14px 4px', height: imgH - 10, objectPosition: st.pos || '50% 50%' }} />}
        <div style={{ fontFamily: BODY, fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: th.goldText, fontFeatureSettings: TNUM }}>{st.date}</div>
        <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1, color: accent, whiteSpace: 'nowrap' }}>{st.place}</div>
        <div style={{ fontFamily: BODY, fontSize: 20, fontStyle: 'italic', color: th.muted, lineHeight: 1.25 }}>{st.what}</div>
      </div>
    </React.Fragment>
  );
}

function Route({ T, C, th }) {
  const show = prog(T, C.Route - 0.4, C.Route + 0.2);
  if (show <= 0) return null;
  const axis = MOTION.draw(prog(T, C.Route - 0.4, C.Route + 0.5));
  const drift = kf(T, [[C.Route, 1], [C.Close + 0.8, 1.01], [C.Close + 1.6, 0.86]], MOTION.draw);
  const lift = kf(T, [[C.Close + 0.8, 0], [C.Close + 1.6, 80]], MOTION.draw);
  const keys = STOPS.flatMap((s) => [[s.at - 0.55, null], [s.at, yx(s.yr)]]);
  // dot travels between stops and rests at each one
  const dotKeys = [[C.Route + 0.1, yx(-1800)]];
  STOPS.forEach((s, i) => { if (i) dotKeys.push([STOPS[i - 1].at + 0.25, yx(STOPS[i - 1].yr)], [s.at, yx(s.yr)]); });
  const dotX = kf(T, dotKeys, MOTION.draw);
  const g = STOPS[3];
  const br = MOTION.draw(prog(T, g.at + 0.3, g.at + 1.1));
  const brLbl = prog(T, g.at + 0.8, g.at + 1.3);
  const india = STOPS[2];
  const rangeP = prog(T, india.at - 0.1, india.at + 0.4);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${lift}px) scale(${drift})`, transformOrigin: `960px ${AX_Y}px` }}>
      <div style={{ position: 'absolute', left: 160, top: AX_Y, width: 1600 * axis, height: 1, background: th.ink, opacity: 0.6 }}></div>
      {TICKS.map(([yr, l], i) => {
        const o = prog(T, C.Route + 0.1 + i * 0.1, C.Route + 0.5 + i * 0.1);
        return (
          <React.Fragment key={yr}>
            <div style={{ position: 'absolute', left: yx(yr), top: AX_Y - 6, width: 1, height: 12, background: th.faint, opacity: o }}></div>
            <div style={{ position: 'absolute', left: yx(yr), top: AX_Y + 14, transform: 'translateX(-50%)', opacity: o * 0.9,
              fontFamily: BODY, fontSize: 18, letterSpacing: '0.14em', color: th.faint, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{l}</div>
          </React.Fragment>
        );
      })}
      {rangeP > 0 && <div style={{ position: 'absolute', left: yx(-800), top: AX_Y - 3, width: (yx(-500) - yx(-800)) * MOTION.draw(rangeP), height: 6, borderRadius: 3, border: `1px solid ${th.gold}` }}></div>}
      {br > 0 && (
        <React.Fragment>
          <div style={{ position: 'absolute', left: yx(-1800), top: AX_Y - 34, width: (yx(-570) - yx(-1800)) * br, height: 1, background: th.gold }}></div>
          <div style={{ position: 'absolute', left: yx(-1800), top: AX_Y - 40, width: 1, height: 13, background: th.gold }}></div>
          <div style={{ position: 'absolute', left: yx(-570), top: AX_Y - 40, width: 1, height: 13, background: th.gold, opacity: br >= 1 ? 1 : 0 }}></div>
          <div style={{ position: 'absolute', left: (yx(-1800) + yx(-570)) / 2, top: AX_Y - 84, transform: 'translateX(-50%)', opacity: brLbl,
            fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: th.goldText, whiteSpace: 'nowrap' }}>more than 1,000 years</div>
        </React.Fragment>
      )}
      {STOPS.map((s, i) => <StopCard key={i} T={T} C={C} th={th} st={s} i={i} />)}
      {T < C.Close + 0.5 && (
        <div style={{ position: 'absolute', left: dotX, top: AX_Y, width: 20, height: 20, transform: 'translate(-50%,-50%)', borderRadius: '50%',
          background: th.gold, opacity: prog(T, C.Route, C.Route + 0.3) * (1 - prog(T, C.Close, C.Close + 0.5)) }}></div>
      )}
    </div>
  );
}

function Headline({ T, C, th }) {
  // line 1 opens the piece, leaves for the tablet, returns at the close with line 2
  const o1 = prog(T, 0.2, 0.8) * (1 - prog(T, C.Babylon - 0.45, C.Babylon + 0.05)) + prog(T, C.Close + 0.6, C.Close + 1.2);
  const y1 = T < C.Babylon + 0.5 ? kf(T, [[0.2, 560], [0.8, 525], [C.Babylon + 0.05, 490]], MOTION.enter) : kf(T, [[C.Close + 0.6, 200], [C.Close + 1.2, 180]], MOTION.enter);
  const size = T < C.Babylon + 0.5 ? 120 : 96;
  const o2 = prog(T, C.Close + 1.0, C.Close + 1.6);
  const kick = prog(T, C.Route + 0.2, C.Route + 0.8) * (1 - prog(T, C.Close + 0.1, C.Close + 0.6));
  return (
    <React.Fragment>
      {kick > 0 && <div style={{ position: 'absolute', left: 160, top: 150, opacity: (kick) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.goldText }}><Words p={kick}>{"Early records of the theorem, c. 1800 BC – AD 263"}</Words></div>}
      {o1 > 0 && <div style={{ position: 'absolute', left: 0, right: 0, top: y1, transform: 'translateY(-50%)', textAlign: 'center', opacity: (Math.min(1, o1)) > 0 ? 1 : 0,
        fontFamily: SERIF, fontSize: size, lineHeight: 1, color: th.ink }}><Words p={Math.min(1, o1)}>{"The theorem is older than Pythagoras."}</Words></div>}
      {o2 > 0 && <div style={{ position: 'absolute', left: 0, right: 0, top: 300 + 16 * (1 - MOTION.enter(o2)), transform: 'translateY(-50%)', textAlign: 'center', opacity: (o2) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 52, lineHeight: 1, color: th.goldText }}><Words p={o2}>{"Babylonian scribes recorded its triples more than 1,000 years before his birth."}</Words></div>}
    </React.Fragment>
  );
}

function HistoryPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 20;
  const fade = 1 - prog(T, end - 0.7, end - 0.05); // loop seam: last frame is the empty page, like the first
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.gold} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Headline T={T} C={CUES} th={th} />
        <Route T={T} C={CUES} th={th} />
        <Tablet T={T} C={CUES} th={th} />
      </div>
    </div>
  );
}

function HistoryApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum' });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <HistoryPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper', 'Colophon']} onChange={(v) => setTweak('ground', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

return HistoryPiece;
})(makeUse("II ", "Open", 20)) });

PIECES.push({ prefix: "III ", first: "Open", total: 92.5, Piece: (function (useComposition) {
// Proofs — five proofs in chronological order, then the gallery. ~74s, 1920x1080, animations-v3.
const W = 1920, H = 1080;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
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
// scenes turn in from one side and away to the other
const SWING = (o) => `perspective(1600px) rotateY(${14 * (1 - o)}deg) translateZ(${-140 * (1 - o)}px) scale(${0.78 + 0.22 * o})`;
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
const THEMES = {
  Museum: { bg: '#202b48', card: '#26324f', ink: '#f2eef0', muted: '#b5b0ab', faint: '#857a9e', accent: '#f5d4f2', tri: '#5f6080', triS: '#b5b0ab', hair: 'rgba(181,176,171,0.35)' },
  Paper: { bg: '#f3f2f2', card: '#f8f6f5', ink: '#201f1d', muted: '#605d5d', faint: '#9b9797', accent: '#7d5411', tri: '#d7d3d3', triS: '#605d5d', hair: 'rgba(32,31,29,0.18)' },
};
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif', TNUM = '"tnum"';

// world geometry (y up), a = 3, b = 4, c = 5
const rot = ([x, y], [cx, cy], deg) => {
  const r = deg * Math.PI / 180, dx = x - cx, dy = y - cy;
  return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)];
};
const pts = (vs, ox, oy, u) => vs.map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(' ');
const TA = [[0, 4], [3, 0], [3, 4]];          // hypotenuse (0,4)-(3,0), right angle (3,4)
const CEN = [3.5, 3.5];
const CHAIR = [ // [k, R_old, R_new, φ]  — TC and TD swing out to make a² + b²
  [2, [4, 3], [7, 0], 90],
  [3, [4, 4], [0, 0], -90],
];

function Reveal({ p, children, style }) {
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - 100 * MOTION.draw(p)}% -20% 0)`, opacity: p > 0 ? 1 : 0,
    transform: `perspective(700px) rotateX(${-70 * (1 - MOTION.enter(p))}deg)`, transformOrigin: '0% 100%' }}>{children}</div>;
}
function FLine({ T, at, th, color, size = 64, children }) {
  const p = prog(T, at, at + 1.6);
  return <Reveal p={p} style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.25, color: color || th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{children}</Reveal>;
}
function Kicker({ th, o, children }) {
  return <div style={{ opacity: (o) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent, fontFeatureSettings: TNUM }}><Words p={o}>{children}</Words></div>;
}

// ---- Euclid, Elements I.47 (world coords, y up): A(0,0), B(5,0), C(3.2,2.4); a = BC = 3, b = AC = 4, c = AB = 5
// Each leg square: square -> sheared parallelogram -> slid down its vertical sides -> rectangle in the c-square.
// Every step moves points parallel to a fixed side, so the area never changes.
const SHEAR_B = [
  [[0, 0], [3.2, 2.4], [0.8, 5.6], [-2.4, 3.2]],
  [[0, 0], [3.2, 2.4], [3.2, 7.4], [0, 5]],
  [[0, -5], [3.2, -2.6], [3.2, 2.4], [0, 0]],
  [[0, -5], [3.2, -5], [3.2, 0], [0, 0]],
];
const SHEAR_A = [
  [[5, 0], [3.2, 2.4], [5.6, 4.2], [7.4, 1.8]],
  [[5, 0], [3.2, 2.4], [3.2, 7.4], [5, 5]],
  [[5, -5], [3.2, -2.6], [3.2, 2.4], [5, 0]],
  [[5, -5], [3.2, -5], [3.2, 0], [5, 0]],
];
const lerpPts = (A, B, p) => A.map((v, i) => [lerp(v[0], B[i][0], p), lerp(v[1], B[i][1], p)]);
function keyPts(keys, ps) {
  let cur = keys[0];
  for (let i = 0; i < ps.length; i++) if (ps[i] > 0) cur = lerpPts(keys[i], keys[i + 1], MOTION.draw(ps[i]));
  return cur;
}
const centroid = (vs) => [vs.reduce((s, v) => s + v[0], 0) / vs.length, vs.reduce((s, v) => s + v[1], 0) / vs.length];
function Note({ o, th, children, style }) {
  return <div style={{ opacity: (o) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 32, lineHeight: 1.45, color: th.muted, textWrap: 'pretty', ...style }}><Words p={o}>{children}</Words></div>;
}

function Euclid({ T, C, th }) {
  const t0 = C.Euclid;
  const out = prog(T, C.Bhaskara - 0.6, C.Bhaskara);
  if (T < t0 - 0.1 || out >= 1) return null;
  const OX = 360, OY = 590, U = 62;
  const fO = prog(T, t0, t0 + 0.6) * (1 - out);
  const triP = prog(T, t0 + 0.4, t0 + 1.2);
  const sqP = (k) => prog(T, t0 + 1.4 + k * 0.35, t0 + 2.2 + k * 0.35);
  const altP = MOTION.draw(prog(T, t0 + 3.0, t0 + 3.8));
  const ph = (k) => [prog(T, t0 + 4.4 + k * 0.3, t0 + 5.8 + k * 0.3), prog(T, t0 + 6.2 + k * 0.3, t0 + 7.4 + k * 0.3), prog(T, t0 + 7.8 + k * 0.3, t0 + 9.0 + k * 0.3)];
  const bPts = keyPts(SHEAR_B, ph(0)), aPts = keyPts(SHEAR_A, ph(1));
  const ghost = prog(T, t0 + 4.4, t0 + 5.0);
  const cLen = 20 * U, cDraw = MOTION.draw(sqP(2));
  const lbl = (txt, [x, y], o, color = th.ink, size = 48) => o > 0 && (
    <div style={{ position: 'absolute', left: OX + x * U, top: OY - y * U, transform: 'translate(-50%,-50%)', opacity: o,
      fontFamily: SERIF, fontStyle: 'italic', fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap' }}>{txt}</div>
  );
  const shape = (vs, alpha, p) => <polygon points={pts(vs, OX, OY, U)} fill={th.accent} fillOpacity={alpha} stroke={th.accent} strokeWidth="2"
    strokeLinejoin="round" opacity={MOTION.enter(p)} />;
  const cO = prog(T, t0 + 2.4, t0 + 2.9) * (1 - prog(T, t0 + 4.2, t0 + 4.6));
  const endO = prog(T, t0 + 9.0, t0 + 9.5);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, opacity: fO, transform: SWING(fO) }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <polygon points={pts([[0, 0], [5, 0], [5, -5], [0, -5]], OX, OY, U)} fill="none" stroke={th.accent} strokeWidth="3"
            strokeDasharray={cLen} strokeDashoffset={cLen * (1 - cDraw)} />
          {ghost > 0 && <polygon points={pts(SHEAR_B[0], OX, OY, U)} fill="none" stroke={th.triS} strokeWidth="1.5" strokeDasharray="6 8" opacity={0.6 * ghost} />}
          {ghost > 0 && <polygon points={pts(SHEAR_A[0], OX, OY, U)} fill="none" stroke={th.triS} strokeWidth="1.5" strokeDasharray="6 8" opacity={0.6 * ghost} />}
          <polygon points={pts([[0, 0], [5, 0], [3.2, 2.4]], OX, OY, U)} fill={th.tri} stroke={th.triS} strokeWidth="2" strokeLinejoin="round" opacity={MOTION.enter(triP)} />
          {shape(bPts, 0.55, sqP(0))}
          {shape(aPts, 0.3, sqP(1))}
          {altP > 0 && <line x1={OX + 3.2 * U} y1={OY - 2.4 * U} x2={OX + 3.2 * U} y2={OY - 2.4 * U + 7.4 * U * altP} stroke={th.ink} strokeWidth="1.5" strokeDasharray="8 7" />}
        </svg>
        {lbl('b²', centroid(bPts), prog(T, t0 + 1.8, t0 + 2.3), th.bg)}
        {lbl('a²', centroid(aPts), prog(T, t0 + 2.1, t0 + 2.6))}
        {lbl('c²', [1.4, -3.9], cO, th.accent)}
        {lbl('a', [3.75, 1.1], MOTION.enter(triP) * (1 - ghost), th.ink, 36)}
        {lbl('b', [2.0, 1.05], MOTION.enter(triP) * (1 - ghost), th.ink, 36)}
        {lbl('c', [2.5, 0.35], MOTION.enter(triP) * (1 - ghost), th.ink, 36)}
        {lbl('c²', [2.5, -5.55], endO, th.accent, 40)}
      </div>
      <div style={{ position: 'absolute', left: 1040, top: 300, width: 720, display: 'flex', flexDirection: 'column', gap: 18, opacity: fO }}>
        <Kicker th={th} o={prog(T, t0 + 0.2, t0 + 0.8)}>Euclid · Alexandria · c. 300 BC</Kicker>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 26, color: th.muted, opacity: (prog(T, t0 + 0.6, t0 + 1.2)) > 0 ? 1 : 0 }}><Words p={prog(T, t0 + 0.6, t0 + 1.2)}>{"Elements, Book I, Proposition 47"}</Words></div>
        <div style={{ height: 8 }}></div>
        <Note o={prog(T, t0 + 4.4, t0 + 5.2)} th={th}>A figure sheared parallel to one of its sides keeps its area.</Note>
        <div style={{ height: 12 }}></div>
        <FLine T={T} at={t0 + 9.2} th={th} size={60}>b² = the left rectangle</FLine>
        <FLine T={T} at={t0 + 10.2} th={th} size={60}>a² = the right rectangle</FLine>
        <FLine T={T} at={t0 + 11.2} th={th} size={60} color={th.accent}>a² + b² = c²</FLine>
      </div>
    </React.Fragment>
  );
}

function Bhaskara({ T, C, th }) {
  const t0 = C.Bhaskara;
  const out = prog(T, C.Garfield, C.Garfield + 0.6);
  if (T < t0 || out >= 1) return null;
  const OX = 300, OY = 870, U = 72;
  const drift = lerp(1, 1.03, prog(T, t0, C.Garfield));
  const first = prog(T, t0 + 0.3, t0 + 1.2);
  const tris = [0, 1, 2, 3].map((k) => {
    const pk = k === 0 ? 1 : prog(T, t0 + 1.9 + (k - 1) * 0.35, t0 + 3.3 + (k - 1) * 0.35);
    let vs = TA.map((v) => rot(v, CEN, 90 * k * MOTION.draw(pk)));
    const ch = CHAIR.find((c) => c[0] === k);
    if (ch) {
      const q = MOTION.draw(prog(T, t0 + 10.4 + (k - 2) * 0.4, t0 + 11.8 + (k - 2) * 0.4));
      const R = [lerp(ch[1][0], ch[2][0], q), lerp(ch[1][1], ch[2][1], q) + Math.sin(Math.PI * q) * 1.2];
      vs = vs.map((v) => { const r = rot(v, ch[1], ch[3] * q); return [r[0] - ch[1][0] + R[0], r[1] - ch[1][1] + R[1]]; });
    }
    const o = k === 0 ? MOTION.enter(first) : (pk > 0 ? 1 : 0);
    return <polygon key={k} points={pts(vs, OX, OY, U)} fill={th.tri} stroke={th.triS} strokeWidth="2" strokeLinejoin="round" opacity={o} />;
  });
  const sqO = prog(T, t0 + 3.6, t0 + 4.2);
  const sqLen = 20 * U, sq = MOTION.draw(prog(T, t0 + 3.4, t0 + 4.2));
  const sqFade = 1 - prog(T, t0 + 10.2, t0 + 10.6);
  const chair = MOTION.draw(prog(T, t0 + 12.0, t0 + 12.7));
  const lbl = (txt, x, y, o, size = 44, color = th.ink, italic = true) => o > 0 && (
    <div style={{ position: 'absolute', left: OX + x * U, top: OY - y * U, transform: 'translate(-50%,-50%)', opacity: o,
      fontFamily: SERIF, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap' }}>{txt}</div>
  );
  const abc = prog(T, t0 + 1.0, t0 + 1.5) * (1 - prog(T, t0 + 1.8, t0 + 2.1));
  const behold = prog(T, t0 + 12.8, t0 + 13.4);
  const fO = 1 - out;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, opacity: fO, transform: `${SWING(fO)} scale(${drift})`, transformOrigin: '552px 620px' }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <polygon points={pts([[3, 3], [4, 3], [4, 4], [3, 4]], OX, OY, U)} fill={th.accent} opacity={sqO} />
          {tris}
          <polygon points={pts([[0, 4], [3, 0], [7, 3], [4, 7]], OX, OY, U)} fill="none" stroke={th.accent} strokeWidth="3"
            strokeDasharray={sqLen} strokeDashoffset={sqLen * (1 - sq)} opacity={sqFade} />
          {chair > 0 && <polyline points={pts([[4, 3], [4, 4], [0, 4], [0, 0], [7, 0], [7, 3], [4, 3], [4, 0]], OX, OY, U)} fill="none"
            stroke={th.accent} strokeWidth="3" strokeLinejoin="round" strokeDasharray={26 * U} strokeDashoffset={26 * U * (1 - chair)} />}
        </svg>
        {lbl('a', 3.35, 2, abc)}{lbl('b', 1.5, 4.4, abc)}{lbl('c', 1.25, 1.7, abc)}
        {lbl('c²', 3.5, 6.0, prog(T, t0 + 4.0, t0 + 4.5) * sqFade, 52, th.accent)}
        {lbl('a²', 5.5, 1.5, prog(T, t0 + 12.4, t0 + 12.9), 56, th.accent)}
        {lbl('b²', 2, 2, prog(T, t0 + 12.4, t0 + 12.9), 56, th.accent)}
      </div>
      <div style={{ position: 'absolute', left: 1040, top: 330, width: 720, display: 'flex', flexDirection: 'column', gap: 18, opacity: fO }}>
        <Kicker th={th} o={prog(T, t0, t0 + 0.6)}>Bhaskara II · India · 12th century</Kicker>
        <div style={{ height: 12 }}></div>
        <FLine T={T} at={t0 + 4.6} th={th}>c² = 4 · ½ab + (b − a)²</FLine>
        <FLine T={T} at={t0 + 6.4} th={th}>{'\u2003'}= 2ab + b² − 2ab + a²</FLine>
        <FLine T={T} at={t0 + 8.2} th={th} color={th.accent}>{'\u2003'}= a² + b²</FLine>
        <div style={{ opacity: behold, transform: `translateY(${16 * (1 - MOTION.enter(behold))}px)`, marginTop: 40,
          fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, lineHeight: 1, color: th.accent }}>Behold!</div>
      </div>
    </React.Fragment>
  );
}

function Garfield({ T, C, th }) {
  const t0 = C.Garfield;
  const out = prog(T, C.Einstein - 0.6, C.Einstein);
  if (T < t0 + 0.4 || out >= 1) return null;
  const OX = 300, OY = 790, U = 72;
  const trapLen = (7 + 3 + 7.28 + 4) * U;
  const outl = MOTION.draw(prog(T, t0 + 0.7, t0 + 1.9));
  const fill = prog(T, t0 + 1.9, t0 + 2.5);
  const ex = MOTION.draw(prog(T, t0 + 2.0, t0 + 3.0)) * (1 - MOTION.draw(prog(T, t0 + 9.4, t0 + 10.2)));
  const G = [3.5, 1.6];
  const tri = [
    { v: [[0, 0], [3, 0], [0, 4]], f: th.tri, l: '½ab' },
    { v: [[3, 0], [7, 0], [7, 3]], f: th.tri, l: '½ab' },
    { v: [[0, 4], [3, 0], [7, 3]], f: th.accent, l: '½c²', dark: true },
  ].map((t) => {
    const c = [(t.v[0][0] + t.v[1][0] + t.v[2][0]) / 3, (t.v[0][1] + t.v[1][1] + t.v[2][1]) / 3];
    const d = [c[0] - G[0], c[1] - G[1]], n = Math.hypot(...d) || 1;
    const off = [d[0] / n * 0.8 * ex, d[1] / n * 0.8 * ex];
    return { ...t, c: [c[0] + off[0], c[1] + off[1]], v: t.v.map(([x, y]) => [x + off[0], y + off[1]]) };
  });
  const lO = prog(T, t0 + 2.8, t0 + 3.3) * (1 - prog(T, t0 + 9.2, t0 + 9.6));
  const fO = prog(T, t0 + 0.4, t0 + 0.9) * (1 - out);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, opacity: fO, transform: SWING(fO) }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          {tri.map((t, i) => <polygon key={i} points={pts(t.v, OX, OY, U)} fill={t.f} opacity={fill} stroke={th.triS} strokeWidth="2" strokeLinejoin="round" />)}
          <polygon points={pts([[0, 0], [7, 0], [7, 3], [0, 4]], OX, OY, U)} fill="none" stroke={th.accent} strokeWidth="3"
            strokeDasharray={trapLen} strokeDashoffset={trapLen * (1 - outl)} opacity={1 - ex} />
        </svg>
        {tri.map((t, i) => lO > 0 && (
          <div key={i} style={{ position: 'absolute', left: OX + t.c[0] * U, top: OY - t.c[1] * U, transform: 'translate(-50%,-50%)', opacity: lO,
            fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, color: t.dark ? th.bg : th.ink, lineHeight: 1 }}>{t.l}</div>
        ))}
        <div style={{ position: 'absolute', left: OX, top: OY + 30, width: 7 * U, display: 'flex', justifyContent: 'space-between',
          opacity: prog(T, t0 + 1.6, t0 + 2.2), fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: th.muted }}>
          <span style={{ width: 3 * U, textAlign: 'center' }}>a</span><span style={{ width: 4 * U, textAlign: 'center' }}>b</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1040, top: 330, width: 720, display: 'flex', flexDirection: 'column', gap: 18, opacity: fO }}>
        <Kicker th={th} o={1}>James A. Garfield · 1876</Kicker>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 26, color: th.muted, opacity: (prog(T, t0 + 0.8, t0 + 1.4)) > 0 ? 1 : 0 }}><Words p={prog(T, t0 + 0.8, t0 + 1.4)}>{"Congressman from Ohio, later the 20th U.S. president"}</Words></div>
        <div style={{ height: 12 }}></div>
        <FLine T={T} at={t0 + 3.4} th={th} size={60}>½(a + b)(a + b) = 2 · ½ab + ½c²</FLine>
        <FLine T={T} at={t0 + 5.2} th={th} size={60}>a² + 2ab + b² = 2ab + c²</FLine>
        <FLine T={T} at={t0 + 7.0} th={th} size={60} color={th.accent}>a² + b² = c²</FLine>
      </div>
    </React.Fragment>
  );
}

// ---- Einstein: the altitude splits ABC into two triangles similar to it (world coords, y up, baseline y = 0)
// Whole ABC sits at x 8.6..13.6; the pieces move rigidly to stand beside it, hypotenuse on the baseline.
const EIN = {
  whole: [[8.6, 0], [13.6, 0], [11.8, 2.4]],
  pieces: [
    { from: [[11.8, 2.4], [13.6, 0], [11.8, 0]], to: [[3, 0], [0, 0], [1.08, 1.44]], alpha: 0.3, hyp: 'a', area: 'k a²', at: 3.0 },   // C, B, D: hypotenuse a
    { from: [[8.6, 0], [11.8, 0], [11.8, 2.4]], to: [[7.8, 0], [5.24, 1.92], [3.8, 0]], alpha: 0.55, hyp: 'b', area: 'k b²', at: 3.3 }, // A, D, C: hypotenuse b
  ],
};
function rigid(from, to, q) {
  const c0 = centroid(from), c1 = centroid(to);
  let th = Math.atan2(to[1][1] - to[0][1], to[1][0] - to[0][0]) - Math.atan2(from[1][1] - from[0][1], from[1][0] - from[0][0]);
  while (th > Math.PI) th -= 2 * Math.PI;
  while (th <= -Math.PI) th += 2 * Math.PI;
  const a = th * q, cs = Math.cos(a), sn = Math.sin(a);
  const cx = lerp(c0[0], c1[0], q), cy = lerp(c0[1], c1[1], q) + Math.sin(Math.PI * q) * 0.9;
  return from.map(([x, y]) => { const dx = x - c0[0], dy = y - c0[1]; return [cx + dx * cs - dy * sn, cy + dx * sn + dy * cs]; });
}

function Einstein({ T, C, th }) {
  const t0 = C.Einstein;
  const out = prog(T, C.Trig - 0.6, C.Trig);
  if (T < t0 - 0.1 || out >= 1) return null;
  const OX = 280, OY = 600, U = 100;
  const fO = prog(T, t0, t0 + 0.5) * (1 - out);
  const triP = MOTION.enter(prog(T, t0 + 0.6, t0 + 1.4));
  const altP = MOTION.draw(prog(T, t0 + 1.8, t0 + 2.6));
  const mark = prog(T, t0 + 2.5, t0 + 2.9);
  const wholeFill = prog(T, t0 + 3.0, t0 + 3.8);
  const lblO = prog(T, t0 + 4.9, t0 + 5.5);
  const lbl = (txt, [x, y], o, color = th.ink, size = 40, italic = true) => o > 0 && (
    <div style={{ position: 'absolute', left: OX + x * U, top: OY - y * U, transform: 'translate(-50%,-50%)', opacity: o,
      fontFamily: SERIF, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap' }}>{txt}</div>
  );
  const m = 0.16, D = [11.8, 0];
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, opacity: fO, transform: SWING(fO) }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <polygon points={pts(EIN.whole, OX, OY, U)} fill={th.tri} fillOpacity={wholeFill} stroke={th.triS} strokeWidth="2" strokeLinejoin="round" opacity={triP} />
          {EIN.pieces.map((pc, i) => {
            const q = MOTION.draw(prog(T, t0 + pc.at, t0 + pc.at + 1.6));
            return <polygon key={i} points={pts(rigid(pc.from, pc.to, q), OX, OY, U)} fill={th.accent} fillOpacity={pc.alpha * prog(T, t0 + 2.6, t0 + 3.0)}
              stroke={th.triS} strokeWidth="2" strokeLinejoin="round" opacity={triP} />;
          })}
          {altP > 0 && <line x1={OX + 11.8 * U} y1={OY - 2.4 * U} x2={OX + 11.8 * U} y2={OY - 2.4 * U + 2.4 * U * altP} stroke={th.ink} strokeWidth="1.5" strokeDasharray="8 7" />}
          {mark > 0 && <polyline points={pts([[D[0] - m, 0], [D[0] - m, m], [D[0], m]], OX, OY, U)} fill="none" stroke={th.ink} strokeWidth="1.5" opacity={mark} />}
        </svg>
        {lbl('a', [1.5, -0.4], lblO, th.muted)}
        {lbl('b', [5.8, -0.4], lblO, th.muted)}
        {lbl('c', [11.1, -0.4], lblO, th.muted)}
        {lbl('k a²', [1.36, 0.48], lblO, th.ink, 36)}
        {lbl('k b²', [5.61, 0.64], lblO, th.bg, 36)}
        {lbl('k c²', [11.33, 0.8], lblO, th.ink, 36)}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: fO }}>
        <Kicker th={th} o={prog(T, t0 + 0.2, t0 + 0.8)}>Albert Einstein · as a boy</Kicker>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 26, color: th.muted, opacity: (prog(T, t0 + 0.5, t0 + 1.1)) > 0 ? 1 : 0 }}><Words p={prog(T, t0 + 0.5, t0 + 1.1)}>{"A proof attributed to him, based on similar triangles"}</Words></div>
      </div>
      <div style={{ position: 'absolute', left: 360, right: 360, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: fO }}>
        <Note o={prog(T, t0 + 3.6, t0 + 4.4)} th={th} style={{ textAlign: 'center' }}>The altitude divides the triangle into two triangles similar to the whole.</Note>
        <div style={{ height: 6 }}></div>
        <FLine T={T} at={t0 + 5.4} th={th} size={60}>k a² + k b² = k c²</FLine>
        <FLine T={T} at={t0 + 6.8} th={th} size={60} color={th.accent}>a² + b² = c²</FLine>
      </div>
    </React.Fragment>
  );
}

// ---- Johnson & Jackson: schematic of a sequence of similar right triangles between two rays (angle φ, cos φ = 0.8)
const JJ_U = 80, JJ_OX = 200, JJ_OY = 760;
const JJ_Z = (() => {
  const u = [0.8, 0.6], Z = [[8, 6]];
  for (let k = 0; k < 26; k++) {
    const p = Z[Z.length - 1];
    if (k % 2 === 0) Z.push([p[0], 0]);
    else { const d = p[0] * u[0] + p[1] * u[1]; Z.push([d * u[0], d * u[1]]); }
  }
  return Z;
})();
const JJ_STEP = (() => { const s = [0]; for (let i = 0; i < 24; i++) s.push(s[i] + 0.5 * Math.pow(0.86, i)); return s; })();

function Trig({ T, C, th }) {
  const t0 = C.Trig;
  const out = prog(T, C.Gallery - 0.6, C.Gallery);
  if (T < t0 - 0.1 || out >= 1) return null;
  const fO = prog(T, t0, t0 + 0.5) * (1 - out);
  const P = (v) => `${JJ_OX + v[0] * JJ_U},${JJ_OY - v[1] * JJ_U}`;
  const rays = MOTION.draw(prog(T, t0 + 0.8, t0 + 1.6));
  const big = MOTION.enter(prog(T, t0 + 1.4, t0 + 2.2));
  const z0 = t0 + 2.4;
  const rayLen = 10 * JJ_U;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, opacity: fO, transform: SWING(fO) }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <line x1={JJ_OX} y1={JJ_OY} x2={JJ_OX + rayLen * rays} y2={JJ_OY} stroke={th.triS} strokeWidth="1.5" />
          <line x1={JJ_OX} y1={JJ_OY} x2={JJ_OX + rayLen * 0.8 * rays} y2={JJ_OY - rayLen * 0.6 * rays} stroke={th.triS} strokeWidth="1.5" />
          <polygon points={[[0, 0], JJ_Z[0], JJ_Z[1]].map(P).join(' ')} fill={th.tri} stroke={th.triS} strokeWidth="2" strokeLinejoin="round" opacity={big} />
          {JJ_STEP.slice(0, 24).map((s, i) => {
            const p = prog(T, z0 + s, z0 + s + 0.5 * Math.pow(0.86, i));
            if (p <= 0) return null;
            return <polygon key={i} points={[JJ_Z[i], JJ_Z[i + 1], JJ_Z[i + 2]].map(P).join(' ')} fill={th.accent} fillOpacity={i % 2 ? 0.28 : 0.55}
              stroke={th.accent} strokeWidth="1.5" strokeLinejoin="round" opacity={MOTION.enter(p)} />;
          })}
        </svg>
        <div style={{ position: 'absolute', left: JJ_OX, top: JJ_OY + 40, width: 760, opacity: prog(T, t0 + 3.0, t0 + 3.6),
          fontFamily: BODY, fontStyle: 'italic', fontSize: 20, color: th.muted }}>Schematic: each triangle is similar to the last, smaller by a fixed ratio r.</div>
      </div>
      <div style={{ position: 'absolute', left: 1040, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 18, opacity: fO }}>
        <Kicker th={th} o={prog(T, t0 + 0.2, t0 + 0.8)}>Johnson & Jackson · 2024</Kicker>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 26, lineHeight: 1.4, color: th.muted, opacity: (prog(T, t0 + 0.5, t0 + 1.1)) > 0 ? 1 : 0 }}><Words p={prog(T, t0 + 0.5, t0 + 1.1)}>{"Calcea Johnson and Ne’Kiya Jackson, then students at St. Mary’s Academy, New Orleans"}</Words></div>
        <div style={{ height: 8 }}></div>
        <Note o={prog(T, t0 + 2.2, t0 + 3.0)} th={th}>Their proof uses trigonometry: it builds infinitely many similar triangles and adds their sides as a geometric series.</Note>
        <div style={{ height: 12 }}></div>
        <FLine T={T} at={t0 + 4.6} th={th} size={60}>a + ar + ar² + ar³ + …</FLine>
        <FLine T={T} at={t0 + 6.0} th={th} size={60} color={th.accent}>{' '}= a ⁄ (1 − r)</FLine>
      </div>
    </React.Fragment>
  );
}

// ---- handoffs: the triangle each proof is built on lifts off, spins and becomes the next proof's triangle
// screen points per proof, ordered [right angle, end of the short leg, end of the long leg]
const ANCHOR = {
  Euclid: [[558.4, 441.2], [670, 590], [360, 590]],
  Bhaskara: [[516, 582], [300, 582], [516, 870]],
  Garfield: [[300, 790], [516, 790], [300, 502]],
  Einstein: [[1460, 360], [1640, 600], [1140, 600]],
  Trig: [[840, 760], [840, 280], [200, 760]],
};
// Bhaskara ends at its 1.03 drift about (552, 620)
const BHASKARA_END = ANCHOR.Bhaskara.map(([x, y]) => [552 + (x - 552) * 1.03, 620 + (y - 620) * 1.03]);
const MORPHS = [['Euclid', 'Bhaskara'], ['Bhaskara', 'Garfield'], ['Garfield', 'Einstein'], ['Einstein', 'Trig']];
function Morph({ T, C, th }) {
  return MORPHS.map(([a, b]) => {
    const N = C[b];
    if (T < N - 0.8 || T > N + 1.8) return null;
    const e = MOTION.draw(prog(T, N - 0.8, N + 0.8));
    const from = a === 'Bhaskara' ? BHASKARA_END : ANCHOR[a], to = ANCHOR[b];
    const lift = 140 * Math.sin(Math.PI * e);
    const P = from.map((p, i) => [lerp(p[0], to[i][0], e), lerp(p[1], to[i][1], e) - lift]);
    const [cx, cy] = centroid(P);
    const o = prog(T, N - 0.8, N - 0.5) * (1 - prog(T, N + 0.8, N + 1.8));
    return (
      <div key={b} style={{ position: 'absolute', inset: 0, opacity: o, transform: `perspective(1400px) rotateY(${360 * e}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <polygon points={P.map((p) => p.join(',')).join(' ')} fill={th.tri} fillOpacity="0.85" stroke={th.accent} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    );
  });
}

const CARDS = [
  { who: 'Euclid', when: 'c. 300 BC', how: 'The windmill', img: 'images/euclid-oxyrhynchus.jpg', pos: '78% 70%' },
  { who: 'Bhaskara II', when: '12th century', how: 'The dissection', fig: 'bhaskara' },
  { who: 'James A. Garfield', when: '1876', how: 'The trapezoid', img: 'images/garfield.jpg', pos: '50% 18%' },
  { who: 'Albert Einstein', when: 'as a boy', how: 'Similar triangles', img: 'images/einstein-child.jpg', pos: '30% 10%' },
  { who: 'C. Johnson & N. Jackson', when: '2024', how: 'Trigonometry', fig: 'trig' },
];
function Gallery({ T, C, th }) {
  const t0 = C.Gallery;
  if (T < t0 + 0.5) return null;
  const h1 = prog(T, t0 + 0.6, t0 + 1.4), h2 = prog(T, t0 + 1.4, t0 + 2.2);
  const drift = lerp(1, 1.02, prog(T, t0, t0 + 8));
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${drift})`, transformOrigin: '960px 540px' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: (h1) > 0 ? 1 : 0, transform: `translateY(${16 * (1 - MOTION.enter(h1))}px)`,
        fontFamily: SERIF, fontSize: 80, lineHeight: 1, color: th.ink, fontFeatureSettings: TNUM }}><Words p={h1}>{"More than 370 proofs of this theorem are known."}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: (h2) > 0 ? 1 : 0, transform: `translateY(${16 * (1 - MOTION.enter(h2))}px)`,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, lineHeight: 1.1, color: th.accent }}><Words p={h2}>{"Their authors include a U.S. president and two high school students."}</Words></div>
      <div style={{ position: 'absolute', left: 160, right: 160, top: 450, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 28 }}>
        {CARDS.map((c, i) => {
          const p = prog(T, t0 + 2.4 + i * 0.3, t0 + 3.0 + i * 0.3);
          const hl = (i === 2 || i === 4);
          return (
            <div key={i} style={{ height: 500, boxSizing: 'border-box', padding: '28px 26px', background: th.card, borderRadius: 4,
              border: `1px solid ${hl ? th.accent : th.hair}`, opacity: MOTION.enter(p),
              transform: `translateY(${30 * (1 - MOTION.enter(p))}px) scale(${0.92 + 0.08 * MOTION.pop(p)})`,
              display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ height: 200, margin: '-14px -12px 6px', flexShrink: 0 }}>
                {c.img && <img src={c.img} style={{ filter: 'sepia(0.22) saturate(0.82) contrast(1.05)', boxSizing: 'border-box', border: `6px solid ${th.card}`, outline: `1px solid ${th.hair}`, width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos, display: 'block' }} />}
                {c.fig === 'bhaskara' && (
                  <svg viewBox="-0.5 -0.5 8 8" width="100%" height="100%" style={{ display: 'block', outline: `1px solid ${th.hair}` }}>
                    {[0, 1, 2, 3].map((k) => <polygon key={k} points={TA.map((v) => rot(v, CEN, 90 * k)).map(([x, y]) => `${x},${7 - y}`).join(' ')} fill={th.tri} stroke={th.triS} strokeWidth="0.05" />)}
                    <polygon points="3,4 4,4 4,3 3,3" fill={th.accent} />
                  </svg>
                )}
                {c.fig === 'trig' && (
                  <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', outline: `1px solid ${th.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, color: th.accent }}>sin · cos</div>
                )}
              </div>
              <div style={{ fontFamily: BODY, fontSize: 20, letterSpacing: '0.16em', textTransform: 'uppercase', color: th.accent, fontFeatureSettings: TNUM }}>{c.when}</div>
              <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.05, color: th.ink, textWrap: 'balance' }}>{c.who}</div>
              <div style={{ flex: 1 }}></div>
              <div style={{ borderTop: `1px solid ${th.hair}`, paddingTop: 14, fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, color: th.muted }}>{c.how}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 975, textAlign: 'center', opacity: prog(T, t0 + 3.6, t0 + 4.3),
        fontFamily: BODY, fontSize: 24, letterSpacing: '0.16em', color: th.muted, fontFeatureSettings: TNUM }}>Elisha Loomis, The Pythagorean Proposition (1940): about 370 proofs</div>
    </div>
  );
}

function Opening({ T, C, th }) {
  const out = prog(T, C.Euclid - 0.6, C.Euclid);
  if (out >= 1) return null;
  const a = prog(T, 0.3, 1.2), b = prog(T, 1.3, 2.3);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: (a) > 0 ? 1 : 0, transform: `translateY(${20 * (1 - MOTION.enter(a))}px)`,
        fontFamily: SERIF, fontSize: 80, lineHeight: 1, color: th.ink, fontFeatureSettings: TNUM }}><Words p={a}>{"More than 370 proofs of this theorem are known."}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 580, textAlign: 'center', opacity: b, transform: `scale(${0.9 + 0.1 * MOTION.pop(b)})`,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, lineHeight: 1, color: th.accent }}>a² + b² = c²</div>
    </div>
  );
}

function Counter({ T, C, th }) {
  const marks = [C.Bhaskara, C.Garfield, C.Einstein, C.Trig];
  const n = 1 + marks.filter((m) => T >= m + 0.3).length;
  const o = prog(T, C.Euclid, C.Euclid + 0.6) * (1 - prog(T, C.Gallery, C.Gallery + 0.5));
  if (o <= 0) return null;
  const last = marks.filter((m) => T >= m).pop();
  const sw = last === undefined ? 0 : prog(T, last, last + 0.6);
  return (
    <div style={{ position: 'absolute', right: 160, top: 150, opacity: o, display: 'flex', alignItems: 'baseline', gap: 12,
      fontFamily: BODY, fontSize: 24, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.muted, fontFeatureSettings: TNUM }}>
      Proof
      <span style={{ fontFamily: SERIF, fontSize: 44, letterSpacing: 0, color: th.accent, display: 'inline-block',
        transform: `translateY(${(sw > 0 && sw < 1) ? -10 * Math.sin(Math.PI * sw) : 0}px)` }}>{n}</span>
      of 370+
    </div>
  );
}

function ProofsPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 92.5;
  const fade = 1 - prog(T, end - 0.7, end - 0.05);
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.accent} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Opening T={T} C={CUES} th={th} />
        <Euclid T={T} C={CUES} th={th} />
        <Bhaskara T={T} C={CUES} th={th} />
        <Garfield T={T} C={CUES} th={th} />
        <Einstein T={T} C={CUES} th={th} />
        <Trig T={T} C={CUES} th={th} />
        <Morph T={T} C={CUES} th={th} />
        <Gallery T={T} C={CUES} th={th} />
        {tweaks.showCounter && <Counter T={T} C={CUES} th={th} />}
      </div>
    </div>
  );
}

function ProofsApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum', showCounter: true });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <ProofsPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
        <TweakToggle label="Proof counter" value={t.showCounter} onChange={(v) => setTweak('showCounter', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

return ProofsPiece;
})(makeUse("III ", "Open", 92.5)) });

PIECES.push({ prefix: "IV ", first: "Open", total: 84.5, Piece: (function (useComposition) {
// Real life — the theorem in everyday measurement. ~63s, 1920x1080, animations-v3.
const W = 1920, H = 1080;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
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
// scenes turn in from one side and away to the other
const SWING = (o) => `perspective(1600px) rotateY(${14 * (1 - o)}deg) translateZ(${-140 * (1 - o)}px) scale(${0.78 + 0.22 * o})`;
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
// handoffs: a glowing outline that morphs triangle → square → circle while it spins, bridging two scenes
const MORPH_N = 72;
const SHAPES = [
  [[-0.5, 0.33], [0.5, 0.33], [-0.5, -0.42]],
  [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  null,
].map((V) => {
  if (!V) return Array.from({ length: MORPH_N }, (_, i) => { const a = -Math.PI * 0.75 + (2 * Math.PI * i) / MORPH_N; return [0.5 * Math.cos(a), 0.5 * Math.sin(a)]; });
  const E = V.map((v, i) => [v, V[(i + 1) % V.length]]), len = E.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), total = len.reduce((x, y) => x + y, 0);
  return Array.from({ length: MORPH_N }, (_, i) => {
    let d = (i / MORPH_N) * total, j = 0;
    while (d > len[j]) { d -= len[j]; j++; }
    const [a, b] = E[j], t = d / len[j];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
});
function ShapeMorph({ T, at, k, cx, cy, size = 360, color }) {
  const q = Math.max(0, Math.min(1, (T - (at - 0.9)) / 1.8));
  if (q <= 0 || q >= 1) return null;
  const e = Easing.easeInOutCubic(q), A = SHAPES[k % 3], B = SHAPES[(k + 1) % 3];
  const s = size * (0.55 + 0.45 * Math.sin(Math.PI * q));
  const pts = A.map((p, i) => `${((p[0] + (B[i][0] - p[0]) * e) * s).toFixed(1)},${((p[1] + (B[i][1] - p[1]) * e) * s).toFixed(1)}`).join(' ');
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: Math.sin(Math.PI * q) }} aria-hidden="true">
      <g transform={`translate(${cx} ${cy}) rotate(${180 * e - 90})`}>
        <polygon points={pts} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" transform="scale(1.2)" />
      </g>
    </svg>
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
const THEMES = {
  Museum: { bg: '#202b48', card: '#26324f', ink: '#f2eef0', muted: '#b5b0ab', faint: '#857a9e', accent: '#f5d4f2', hair: 'rgba(181,176,171,0.35)' },
  Paper: { bg: '#f3f2f2', card: '#eae9e9', ink: '#201f1d', muted: '#605d5d', faint: '#9b9797', accent: '#7d5411', hair: 'rgba(32,31,29,0.18)' },
};
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif', TNUM = '"tnum"';
const PLATE_FILTER = 'sepia(0.22) saturate(0.82) contrast(1.05)';

// pts are fractions of the photograph; the right angle is at pts[1]
const SCENES = [
  { cue: 'Construction', img: 'images/rl-square.jpg', ar: 1917 / 1077,
    pts: [[0.086, 0.265], [0.086, 0.822], [0.503, 0.822]], labels: ['3 ft', '4 ft', '5 ft'],
    kicker: 'Construction', title: 'Squaring a corner',
    lines: ['3² + 4² = 9 + 16', '= 25 = 5²'],
    note: 'Mark 3 ft and 4 ft along two lines. If the diagonal is 5 ft, the corner is square.' },
  { cue: 'Baseball', img: 'images/rl-diamond.jpg', ar: 4 / 3, zoom: { cx: 0.51, cy: 0.68, s: 3 },
    pts: [[0.476, 0.737], [0.5195, 0.679], [0.476, 0.621]], labels: ['90 ft', '90 ft', '127.28 ft'],
    kicker: 'Baseball', title: 'Home plate to second base',
    lines: ['90² + 90² = 16,200', '√16,200 ≈ 127.28 ft'],
    // ⅜ is set in Cormorant: Lora has no vulgar fractions
    note: <React.Fragment>The official rules set second base 127 ft 3<span style={{ fontFamily: SERIF, fontSize: '1.15em', lineHeight: 1 }}>⅜</span> in from home plate.</React.Fragment> },
  { cue: 'Screen', img: 'images/rl-tv.jpg', ar: 4 / 3,
    pts: [[0.695, 0.279], [0.695, 0.606], [0.267, 0.606]], labels: ['27.0 in', '47.9 in', '55 in'],
    kicker: 'Television and phone screens', title: 'Screen size is measured on the diagonal',
    lines: ['47.9² + 27.0² ≈ 3,023', '√3,023 ≈ 55 in'],
    note: 'A 55-inch 16:9 screen is about 47.9 in wide and 27.0 in tall.' },
  { cue: 'Ladder', img: 'images/rl-ladder.jpg', ar: 4 / 3,
    pts: [[0.513, 0.20], [0.513, 0.93], [0.376, 0.93]], labels: ['16 ft', '4 ft', '16.5 ft'], labelNudge: [[70, 0], [0, 0], [-60, -60]],
    kicker: 'Ladder safety', title: 'The four-to-one rule',
    lines: ['16² + 4² = 272', '√272 ≈ 16.5 ft'],
    note: 'Safety guidance places the base 1 ft from the wall for every 4 ft of height.' },
  // drawn figures (no photograph): pts are fractions of the figure box, as above
  { cue: 'Ramp', draw: 'ramp', ar: 880 / 400,
    pts: [[0.86, 0.553], [0.86, 0.70], [0.06, 0.70]], labels: ['2 ft', '24 ft', '24.08 ft'], labelNudge: [[0, 0], [40, 30], [0, -45]],
    kicker: 'Accessibility', title: 'Ramp length from rise and run',
    lines: ['24² + 2² = 580', '√580 ≈ 24.08 ft'],
    note: 'The ADA limits a ramp to a slope of 1:12.' },
  { cue: 'Wind', draw: 'wind', ar: 880 / 600, arrows: [[0, 1], [1, 2], [0, 2]],
    pts: [[0.47, 0.88], [0.47, 0.113], [0.509, 0.113]], labels: ['400 mph', '30 mph', '401 mph'], labelNudge: [[-80, -60], [-75, 25], [90, -60]],
    kicker: 'Aviation', title: 'Airspeed and crosswind',
    lines: ['400² + 30² = 160,900', '√160,900 ≈ 401 mph'],
    note: 'An aircraft heading north at 400 mph in a 30 mph wind from the west moves over the ground at about 401 mph.' },
];

// background for a drawn figure, in the figure's own pixel box (w x h)
function Backdrop({ sc, w, h, th }) {
  const X = (f) => f * w, Y = (f) => f * h, k = w / 880;
  const line = { stroke: th.muted, strokeWidth: 2 * k, fill: 'none', strokeLinecap: 'round' };
  const small = { fontFamily: BODY, fontStyle: 'italic', fontSize: 22 * k, fill: th.muted };
  if (sc.draw === 'ramp') {
    return (
      <g>
        <line x1={X(0.02)} y1={Y(0.70)} x2={X(0.98)} y2={Y(0.70)} {...line} />
        <rect x={X(0.86)} y={Y(0.553)} width={X(0.98) - X(0.86)} height={Y(0.70) - Y(0.553)} fill={th.bg} stroke={th.muted} strokeWidth="1.5" />
        <rect x={X(0.895)} y={Y(0.553) - h * 0.51} width={X(0.955) - X(0.895)} height={h * 0.51} {...line} />
        <text x={X(0.06)} y={Y(0.70) + h * 0.16} {...small}>Slope 1:12</text>
      </g>
    );
  }
  if (sc.draw === 'wind') {
    const streak = (y) => (
      <g key={y}>
        <line x1={X(0.10)} y1={Y(y)} x2={X(0.27)} y2={Y(y)} {...line} />
        <polyline points={`${X(0.27) - 12 * k},${Y(y) - 7 * k} ${X(0.27)},${Y(y)} ${X(0.27) - 12 * k},${Y(y) + 7 * k}`} {...line} />
      </g>
    );
    return (
      <g>
        {[0.42, 0.52, 0.62].map(streak)}
        <text x={X(0.10)} y={Y(0.70)} {...small}>Wind from the west, 30 mph</text>
        <line x1={X(0.86)} y1={Y(0.26)} x2={X(0.86)} y2={Y(0.12)} {...line} />
        <polyline points={`${X(0.86) - 8 * k},${Y(0.12) + 12 * k} ${X(0.86)},${Y(0.12)} ${X(0.86) + 8 * k},${Y(0.12) + 12 * k}`} {...line} />
        <text x={X(0.86)} y={Y(0.12) - 12 * k} textAnchor="middle" style={{ fontFamily: SERIF, fontSize: 26 * k }} fill={th.muted}>N</text>
      </g>
    );
  }
  return null;
}

function triGeom(sc, w, h, tx = 0, ty = 0, s = 1) {
  const nudge = sc.labelNudge || [];
  const P = sc.pts.map(([x, y]) => [tx + x * w * s, ty + y * h * s]);
  const c = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
  const sides = [[P[0], P[1]], [P[1], P[2]], [P[2], P[0]]].map(([a, b]) => {
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = [m[0] - c[0], m[1] - c[1]], n = Math.hypot(...d) || 1;
    return { a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]), lab: [m[0] + d[0] / n * 40, m[1] + d[1] / n * 40] };
  });
  const pad = 34; sides.forEach((sd, i) => { const nd = nudge[i] || [0, 0]; sd.lab = [sd.lab[0] + nd[0], sd.lab[1] + nd[1]]; sd.lab = [Math.max(pad + 30, Math.min(w - pad - 30, sd.lab[0])), Math.max(pad, Math.min(h - pad, sd.lab[1]))]; });
  return { P, sides };
}

// a matted photograph with its triangle traced over it
function Plate({ sc, w, zoomP, drawP, labelP, th, labelSize = 32, stroke = 4 }) {
  const h = w / sc.ar;
  const z = sc.zoom, q = MOTION.draw(zoomP);
  const s = z ? lerp(1, z.s, q) : 1 + 0.04 * zoomP;
  const tx = z ? lerp(0, w * 0.5 - z.cx * w * z.s, q) : -w * 0.02 * zoomP;
  const ty = z ? lerp(0, h * 0.5 - z.cy * h * z.s, q) : -h * 0.02 * zoomP;
  const g = triGeom(sc, w, h, tx, ty, s);
  const per = g.sides.reduce((a, sd) => a + sd.len, 0);
  const B = g.P[1], u = (p) => { const d = [p[0] - B[0], p[1] - B[1]], n = Math.hypot(...d); return [d[0] / n, d[1] / n]; };
  const ua = u(g.P[0]), uc = u(g.P[2]), m = 20;
  const mark = `${B[0] + ua[0] * m},${B[1] + ua[1] * m} ${B[0] + (ua[0] + uc[0]) * m},${B[1] + (ua[1] + uc[1]) * m} ${B[0] + uc[0] * m},${B[1] + uc[1] * m}`;
  const poly = g.P.map((p) => p.join(',')).join(' ');
  const dp = MOTION.draw(drawP);
  return (
    <div style={{ position: 'relative', width: w, height: h, boxSizing: 'content-box', border: `6px solid ${th.card}`, outline: `1px solid ${th.hair}`, overflow: 'hidden' }}>
      {sc.img ? <img src={sc.img} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0',
        transform: `translate(${tx}px,${ty}px) scale(${s})`, filter: PLATE_FILTER, display: 'block' }} />
        : <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', overflow: 'visible',
          transform: `translate(${tx}px,${ty}px) scale(${s})`, background: th.card, display: 'block' }}><Backdrop sc={sc} w={w} h={h} th={th} /></svg>}
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <polygon points={poly} fill="none" stroke="#202b48" strokeOpacity="0.55" strokeWidth={stroke + 5} strokeLinejoin="round"
          strokeDasharray={per} strokeDashoffset={per * (1 - dp)} />
        <polygon points={poly} fill={th.accent} fillOpacity={0.16 * prog(dp, 0.8, 1)} stroke={th.accent} strokeWidth={stroke} strokeLinejoin="round"
          strokeDasharray={per} strokeDashoffset={per * (1 - dp)} />
        <polyline points={mark} fill="none" stroke={th.accent} strokeWidth={stroke * 0.6} opacity={prog(drawP, 0.85, 1)} />
        {(sc.arrows || []).map(([i0, i1], k) => {
          const A = g.P[i0], Bp = g.P[i1], d = [Bp[0] - A[0], Bp[1] - A[1]], n = Math.hypot(...d) || 1, ux = d[0] / n, uy = d[1] / n, L = stroke * 4;
          const head = `${Bp[0]},${Bp[1]} ${Bp[0] - ux * L - uy * L * 0.5},${Bp[1] - uy * L + ux * L * 0.5} ${Bp[0] - ux * L + uy * L * 0.5},${Bp[1] - uy * L - ux * L * 0.5}`;
          return <polygon key={k} points={head} fill={th.accent} opacity={prog(drawP, 0.9, 1)} />;
        })}
      </svg>
      {labelP > 0 && g.sides.map((sd, i) => (
        <div key={i} style={{ position: 'absolute', left: sd.lab[0], top: sd.lab[1], transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * MOTION.pop(prog(labelP, i * 0.25, i * 0.25 + 0.5))})`,
          opacity: prog(labelP, i * 0.25, i * 0.25 + 0.5), background: '#202b48', color: '#f5d4f2', padding: '2px 12px 6px', borderRadius: 4,
          fontFamily: SERIF, fontSize: labelSize, lineHeight: 1, whiteSpace: 'nowrap', fontFeatureSettings: TNUM }}>{sd.l || sc.labels[i]}</div>
      ))}
    </div>
  );
}

function Reveal({ p, children, style }) {
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - 100 * MOTION.draw(p)}% -20% 0)`, opacity: p > 0 ? 1 : 0,
    transform: `perspective(700px) rotateX(${-70 * (1 - MOTION.enter(p))}deg)`, transformOrigin: '0% 100%' }}>{children}</div>;
}

function Scene({ T, C, th, sc, next }) {
  const t0 = C[sc.cue], t1 = C[next];
  const inP = prog(T, t0 - 0.2, t0 + 0.8), out = prog(T, t1 - 0.7, t1 - 0.05);
  if (inP <= 0 || out >= 1) return null;
  const o = MOTION.enter(inP) * (1 - out);
  const zoomP = sc.zoom ? prog(T, t0 + 0.8, t0 + 3.0) : prog(T, t0, t1);
  const d0 = sc.zoom ? t0 + 3.0 : t0 + 1.6;
  const drawP = prog(T, d0, d0 + 1.4), labelP = prog(T, d0 + 1.2, d0 + 2.4);
  const L0 = d0 + 2.0;
  const pw = 800, ph = pw / sc.ar;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, transform: SWING(o) }}>
      <div style={{ position: 'absolute', left: 160, top: 560 - ph / 2, transform: `translateY(${24 * (1 - MOTION.enter(inP))}px)` }}>
        <Plate sc={sc} w={pw} zoomP={zoomP} drawP={drawP} labelP={labelP} th={th} />
      </div>
      <div style={{ position: 'absolute', left: 1040, top: 250, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ opacity: (prog(T, t0 + 0.3, t0 + 1.0)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent }}><Words p={prog(T, t0 + 0.3, t0 + 1.0)}>{sc.kicker}</Words></div>
        <div style={{ opacity: (prog(T, t0 + 0.5, t0 + 1.3)) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 60, lineHeight: 1.05, color: th.ink, textWrap: 'balance' }}><Words p={prog(T, t0 + 0.5, t0 + 1.3)}>{sc.title}</Words></div>
        <div style={{ opacity: (prog(T, t0 + 0.9, t0 + 2.4)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 32, lineHeight: 1.45, color: th.muted, textWrap: 'pretty' }}><Words p={prog(T, t0 + 0.9, t0 + 2.4)}>{sc.note}</Words></div>
        <div style={{ height: 28, borderBottom: `1px solid ${th.hair}`, opacity: prog(T, t0 + 1.6, t0 + 2.2) }}></div>
        <div style={{ height: 12 }}></div>
        {sc.lines.map((l, i) => (
          <Reveal key={i} p={prog(T, L0 + i * 1.8, L0 + i * 1.8 + 1.6)} style={{ fontFamily: SERIF, fontSize: 60, lineHeight: 1.2, color: i === sc.lines.length - 1 ? th.accent : th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{l}</Reveal>
        ))}
      </div>
    </div>
  );
}

function Opening({ T, C, th }) {
  const out = prog(T, C.Construction - 0.7, C.Construction - 0.05);
  if (out >= 1) return null;
  const a = prog(T, 0.3, 1.3), b = prog(T, 1.0, 1.8);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: (a) > 0 ? 1 : 0, transform: `translateY(${20 * (1 - MOTION.enter(a))}px)`,
        fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: th.ink }}><Words p={a}>{"The theorem in everyday measurement"}</Words></div>
      <div style={{ position: 'absolute', left: 360, right: 360, top: 540, textAlign: 'center', opacity: (b) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, lineHeight: 1.3, color: th.accent, textWrap: 'balance' }}><Words p={b}>{"Wherever a straight-line distance or a true right angle is required, a² + b² = c² is applied."}</Words></div>
    </div>
  );
}

function Close({ T, C, th }) {
  const t0 = C.Close;
  if (T < t0 - 0.3) return null;
  const h = prog(T, t0 - 0.2, t0 + 0.8);
  const pw = 240;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, transform: `translateY(${16 * (1 - MOTION.enter(h))}px)`,
        fontFamily: SERIF, fontSize: 80, lineHeight: 1, color: th.ink }}><Words p={h}>{"Two measured sides give the third."}</Words></div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 430, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 20 }}>
        {SCENES.map((sc, i) => {
          const p = prog(T, t0 + 0.4 + i * 0.3, t0 + 1.1 + i * 0.3);
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: MOTION.enter(p), transform: `translateY(${30 * (1 - MOTION.enter(p))}px)` }}>
              <div style={{ height: pw * 3 / 4, display: 'flex', alignItems: 'center' }}>
                <Plate sc={sc} w={pw} zoomP={1} drawP={prog(T, t0 + 0.8 + i * 0.3, t0 + 1.8 + i * 0.3)} labelP={0} th={th} stroke={3} />
              </div>
              <div style={{ fontFamily: BODY, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.accent }}>{sc.kicker.split(' and ')[0]}</div>
              <div style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1, color: th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{sc.lines[sc.lines.length - 1].replace(/^= /, '')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RealLifePiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 84.5;
  const fade = 1 - prog(T, end - 0.7, end - 0.05);
  const order = ['Construction', 'Baseball', 'Screen', 'Ladder', 'Ramp', 'Wind', 'Close'];
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.accent} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Opening T={T} C={CUES} th={th} />
        {SCENES.map((sc, i) => <Scene key={sc.cue} T={T} C={CUES} th={th} sc={sc} next={order[i + 1]} />)}
        <Close T={T} C={CUES} th={th} />
        {/* Construction */}<ShapeMorph T={T} at={CUES.Construction} k={0} cx={560} cy={560} color={th.accent} />
        {/* Baseball */}<ShapeMorph T={T} at={CUES.Baseball} k={1} cx={560} cy={560} color={th.accent} />
        {/* Screen */}<ShapeMorph T={T} at={CUES.Screen} k={2} cx={560} cy={560} color={th.accent} />
        {/* Ladder */}<ShapeMorph T={T} at={CUES.Ladder} k={3} cx={560} cy={560} color={th.accent} />
        {/* Ramp */}<ShapeMorph T={T} at={CUES.Ramp} k={4} cx={560} cy={560} color={th.accent} />
        {/* Wind */}<ShapeMorph T={T} at={CUES.Wind} k={5} cx={560} cy={560} color={th.accent} />
      </div>
    </div>
  );
}

function RealLifeApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum' });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <RealLifePiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

return RealLifePiece;
})(makeUse("IV ", "Open", 84.5)) });

PIECES.push({ prefix: "V ", first: "Open", total: 82.5, Piece: (function (useComposition) {
// Computing — the theorem as the measure of distance in software. ~64s, 1920x1080, animations-v3.
const W = 1920, H = 1080;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
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
// handoffs: a glowing outline that morphs triangle → square → circle while it spins, bridging two scenes
const MORPH_N = 72;
const SHAPES = [
  [[-0.5, 0.33], [0.5, 0.33], [-0.5, -0.42]],
  [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  null,
].map((V) => {
  if (!V) return Array.from({ length: MORPH_N }, (_, i) => { const a = -Math.PI * 0.75 + (2 * Math.PI * i) / MORPH_N; return [0.5 * Math.cos(a), 0.5 * Math.sin(a)]; });
  const E = V.map((v, i) => [v, V[(i + 1) % V.length]]), len = E.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), total = len.reduce((x, y) => x + y, 0);
  return Array.from({ length: MORPH_N }, (_, i) => {
    let d = (i / MORPH_N) * total, j = 0;
    while (d > len[j]) { d -= len[j]; j++; }
    const [a, b] = E[j], t = d / len[j];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
});
function ShapeMorph({ T, at, k, cx, cy, size = 360, color }) {
  const q = Math.max(0, Math.min(1, (T - (at - 0.9)) / 1.8));
  if (q <= 0 || q >= 1) return null;
  const e = Easing.easeInOutCubic(q), A = SHAPES[k % 3], B = SHAPES[(k + 1) % 3];
  const s = size * (0.55 + 0.45 * Math.sin(Math.PI * q));
  const pts = A.map((p, i) => `${((p[0] + (B[i][0] - p[0]) * e) * s).toFixed(1)},${((p[1] + (B[i][1] - p[1]) * e) * s).toFixed(1)}`).join(' ');
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: Math.sin(Math.PI * q) }} aria-hidden="true">
      <g transform={`translate(${cx} ${cy}) rotate(${180 * e - 90})`}>
        <polygon points={pts} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" transform="scale(1.2)" />
      </g>
    </svg>
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
const THEMES = {
  Museum: { bg: '#202b48', card: '#26324f', ink: '#f2eef0', muted: '#b5b0ab', faint: '#857a9e', accent: '#f5d4f2', hair: 'rgba(181,176,171,0.35)', grid: 'rgba(181,176,171,0.12)' },
  Paper: { bg: '#f3f2f2', card: '#eae9e9', ink: '#201f1d', muted: '#605d5d', faint: '#9b9797', accent: '#7d5411', hair: 'rgba(32,31,29,0.18)', grid: 'rgba(32,31,29,0.08)' },
};
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif', TNUM = '"tnum"';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';
const fmt = (n) => Math.round(n).toLocaleString('en-US');

// deterministic pseudo-random numbers
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function Reveal({ p, children, style }) {
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - 100 * MOTION.draw(p)}% -20% 0)`, opacity: p > 0 ? 1 : 0,
    transform: `perspective(700px) rotateX(${-70 * (1 - MOTION.enter(p))}deg)`, transformOrigin: '0% 100%' }}>{children}</div>;
}
function FLine({ T, at, th, color, size = 60, children }) {
  return <Reveal p={prog(T, at, at + 1.6)} style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.25, color: color || th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{children}</Reveal>;
}
// the right-hand column shared by every scene
function Column({ T, t0, th, kicker, title, note, noteAt = 0.9, children }) {
  return (
    <div style={{ position: 'absolute', left: 1040, top: 250, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ opacity: (prog(T, t0 + 0.3, t0 + 1.0)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent }}><Words p={prog(T, t0 + 0.3, t0 + 1.0)}>{kicker}</Words></div>
      <div style={{ opacity: (prog(T, t0 + 0.5, t0 + 1.3)) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 60, lineHeight: 1.05, color: th.ink, textWrap: 'balance' }}><Words p={prog(T, t0 + 0.5, t0 + 1.3)}>{title}</Words></div>
      <div style={{ opacity: (prog(T, t0 + noteAt, t0 + noteAt + 1.8)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 32, lineHeight: 1.45, color: th.muted, textWrap: 'pretty' }}><Words p={prog(T, t0 + noteAt, t0 + noteAt + 1.8)}>{note}</Words></div>
      <div style={{ height: 24, borderBottom: `1px solid ${th.hair}`, opacity: prog(T, t0 + 1.6, t0 + 2.2) }}></div>
      <div style={{ height: 8 }}></div>
      {children}
    </div>
  );
}
function useScene(T, C, name, next) {
  const t0 = C[name], t1 = C[next];
  const inP = prog(T, t0 - 0.2, t0 + 0.6), out = prog(T, t1 - 0.6, t1 - 0.05);
  const turn = 16 * (1 - MOTION.enter(inP)) - 16 * MOTION.draw(out), depth = -160 * (1 - MOTION.enter(inP)) - 160 * MOTION.draw(out);
  return { t0, t1, show: inP > 0 && out < 1, o: MOTION.enter(inP) * (1 - out), tf: `perspective(1600px) rotateY(${turn}deg) translateZ(${depth}px) scale(${0.78 + 0.22 * MOTION.enter(inP) - 0.22 * MOTION.draw(out)})` };
}
// set subscript (Cormorant has no subscript n, so both indices are set the same way)
const Sub = ({ children, italic }) => <span style={{ fontSize: '0.62em', fontStyle: italic ? 'italic' : 'normal', verticalAlign: '-0.2em', lineHeight: 0 }}>{children}</span>;
// a framed figure area on the left
function Frame({ x = 160, y = 250, w = 800, h = 600, th, children }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', background: th.card,
      border: `6px solid ${th.card}`, outline: `1px solid ${th.hair}`, overflow: 'hidden' }}>{children}</div>
  );
}

// ---------------- Open ----------------
function Opening({ T, C, th }) {
  const out = prog(T, C.Distance - 0.7, C.Distance - 0.05);
  if (out >= 1) return null;
  const a = prog(T, 0.3, 1.3), b = prog(T, 1.0, 1.8);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: (a) > 0 ? 1 : 0, transform: `translateY(${20 * (1 - MOTION.enter(a))}px)`,
        fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: th.ink }}><Words p={a}>{"The theorem in computing"}</Words></div>
      <div style={{ position: 'absolute', left: 360, right: 360, top: 540, textAlign: 'center', opacity: (b) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, lineHeight: 1.3, color: th.accent, textWrap: 'balance' }}><Words p={b}>{"Wherever a program measures how close two things are, it applies a² + b² = c²."}</Words></div>
    </div>
  );
}

// ---------------- Distance ----------------
function Distance({ T, C, th }) {
  const s = useScene(T, C, 'Distance', 'Collision');
  if (!s.show) return null;
  const t0 = s.t0, CELL = 70, COLS = 10, ROWS = 8, FW = COLS * CELL, FH = ROWS * CELL;
  const X = (x) => 50 + x * CELL, Y = (y) => 20 + (ROWS - y) * CELL;
  const P = [1, 1], Q = [9, 7];
  const ptP = MOTION.pop(prog(T, t0 + 0.8, t0 + 1.3)), ptQ = MOTION.pop(prog(T, t0 + 1.0, t0 + 1.5));
  const seg = MOTION.draw(prog(T, t0 + 1.6, t0 + 2.6));
  const legX = MOTION.draw(prog(T, t0 + 2.4, t0 + 3.2)), legY = MOTION.draw(prog(T, t0 + 3.0, t0 + 3.8));
  const lbl = (txt, x, y, o, color = th.ink) => o > 0 && (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o, background: th.bg, color, padding: '2px 12px 6px', borderRadius: 4,
      fontFamily: SERIF, fontStyle: 'italic', fontSize: 34, lineHeight: 1, whiteSpace: 'nowrap', fontFeatureSettings: TNUM }}>{txt}</div>
  );
  const segLen = Math.hypot(X(Q[0]) - X(P[0]), Y(Q[1]) - Y(P[1]));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <Frame th={th} y={240} h={FH + 60}>
        <svg width={800} height={FH + 60} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: COLS + 1 }, (_, i) => <line key={'v' + i} x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(ROWS)} stroke={th.grid} strokeWidth="1" />)}
          {Array.from({ length: ROWS + 1 }, (_, i) => <line key={'h' + i} x1={X(0)} y1={Y(i)} x2={X(COLS)} y2={Y(i)} stroke={th.grid} strokeWidth="1" />)}
          <line x1={X(P[0])} y1={Y(P[1])} x2={X(P[0]) + (X(Q[0]) - X(P[0])) * legX} y2={Y(P[1])} stroke={th.muted} strokeWidth="2" strokeDasharray="8 7" />
          <line x1={X(Q[0])} y1={Y(P[1])} x2={X(Q[0])} y2={Y(P[1]) + (Y(Q[1]) - Y(P[1])) * legY} stroke={th.muted} strokeWidth="2" strokeDasharray="8 7" opacity={legY > 0 ? 1 : 0} />
          <line x1={X(P[0])} y1={Y(P[1])} x2={X(Q[0])} y2={Y(Q[1])} stroke={th.accent} strokeWidth="4" strokeDasharray={segLen} strokeDashoffset={segLen * (1 - seg)} />
          <circle cx={X(P[0])} cy={Y(P[1])} r={11 * ptP} fill={th.accent} />
          <circle cx={X(Q[0])} cy={Y(Q[1])} r={11 * ptQ} fill={th.accent} />
        </svg>
        {lbl('Δx = 8', (X(P[0]) + X(Q[0])) / 2, Y(P[1]) + 34, prog(T, t0 + 3.0, t0 + 3.5), th.muted)}
        {lbl('Δy = 6', X(Q[0]) + 66, (Y(P[1]) + Y(Q[1])) / 2, prog(T, t0 + 3.6, t0 + 4.1), th.muted)}
        {lbl('d = 10', (X(P[0]) + X(Q[0])) / 2 - 40, (Y(P[1]) + Y(Q[1])) / 2 - 34, prog(T, t0 + 4.0, t0 + 4.5), th.accent)}
      </Frame>
      <Column T={T} t0={t0} th={th} kicker="Distance" title="From two dimensions to n"
        note="Applied once, the theorem gives the distance between two points in a plane.">
        <FLine T={T} at={t0 + 3.8} th={th}>d = √(Δx² + Δy²)</FLine>
        <FLine T={T} at={t0 + 4.8} th={th}>d = √(Δx² + Δy² + Δz²)</FLine>
        <FLine T={T} at={t0 + 5.8} th={th} color={th.accent}>d = √(Δx<Sub>1</Sub>² + … + Δx<Sub italic>n</Sub>²)</FLine>
      </Column>
    </div>
  );
}

// ---------------- Collision ----------------
const COL = { ax0: 300, ax1: 520, bx0: 780, bx1: 620, ay: 360, by: 320, ra: 60, rb: 80, stop: 0.93 };
function Collision({ T, C, th }) {
  const s = useScene(T, C, 'Collision', 'Path');
  if (!s.show) return null;
  const t0 = s.t0;
  const m = Math.min(COL.stop, prog(T, t0 + 1.2, t0 + 7.0));
  const ax = lerp(COL.ax0, COL.ax1, m), bx = lerp(COL.bx0, COL.bx1, m);
  const dx = bx - ax, dy = COL.ay - COL.by, d2 = dx * dx + dy * dy, r2 = (COL.ra + COL.rb) ** 2;
  const hit = d2 < r2;
  const hitT = t0 + 1.2 + 5.8 * 0.9105; // the moment dx² + dy² first falls below (r₁ + r₂)²
  const flash = prog(T, hitT, hitT + 0.8);
  const hud = prog(T, t0 + 1.0, t0 + 1.6);
  const row = (k, v, color = th.ink) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}><span style={{ color: th.muted }}>{k}</span><span style={{ color, fontFeatureSettings: TNUM }}>{v}</span></div>
  );
  const circ = (x, y, r, lab) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={th.accent} fillOpacity={hit ? 0.45 : 0.08} stroke={hit ? th.accent : th.ink} strokeWidth="3" />
      <circle cx={x} cy={y} r={4} fill={th.ink} />
      <text x={x} y={y + r + 30} textAnchor="middle" style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 28 }} fill={th.muted}>{lab}</text>
    </g>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <Frame th={th} y={240} h={620}>
        <svg width={800} height={620} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 17 }, (_, i) => <line key={'v' + i} x1={i * 50} y1={0} x2={i * 50} y2={620} stroke={th.grid} strokeWidth="1" />)}
          {Array.from({ length: 13 }, (_, i) => <line key={'h' + i} x1={0} y1={i * 50} x2={800} y2={i * 50} stroke={th.grid} strokeWidth="1" />)}
          {flash > 0 && flash < 1 && <circle cx={(ax + bx) / 2} cy={(COL.ay + COL.by) / 2} r={40 + 160 * MOTION.enter(flash)} fill="none" stroke={th.accent} strokeWidth="2" opacity={1 - flash} />}
          {circ(ax, COL.ay, COL.ra, 'r₁ = 60')}
          {circ(bx, COL.by, COL.rb, 'r₂ = 80')}
          <line x1={ax} y1={COL.ay} x2={bx} y2={COL.by} stroke={th.ink} strokeWidth="1.5" strokeDasharray="6 6" opacity={hud} />
        </svg>
        <div style={{ position: 'absolute', left: 24, top: 20, width: 400, opacity: hud, fontFamily: MONO, fontSize: 22, lineHeight: 1.6, color: th.ink,
          background: th.bg, padding: '12px 18px', borderRadius: 4, border: `1px solid ${th.hair}` }}>
          {row('dx', fmt(dx))}
          {row('dy', fmt(dy))}
          {row('dx² + dy²', fmt(d2))}
          {row('(r₁ + r₂)²', fmt(r2))}
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${th.hair}`, color: hit ? th.accent : th.muted, whiteSpace: 'nowrap' }}>{hit ? `${fmt(d2)} < ${fmt(r2)}: contact` : `${fmt(d2)} > ${fmt(r2)}: clear`}</div>
        </div>
      </Frame>
      <Column T={T} t0={t0} th={th} kicker="Video games and physics engines" title="Collision detection"
        note="Two circles overlap when the squared distance between their centers is less than the square of the sum of their radii.">
        <FLine T={T} at={t0 + 3.2} th={th} color={th.accent}>dx² + dy² &lt; (r₁ + r₂)²</FLine>
      </Column>
    </div>
  );
}

// ---------------- Path (A*, 8 directions, straight-line heuristic) ----------------
const GRID = { cols: 14, rows: 9, cell: 50, start: [1, 4], goal: [12, 4] };
const WALLS = (() => {
  const w = new Set();
  for (let y = 0; y <= 6; y++) w.add(`5,${y}`);
  for (let y = 2; y <= 8; y++) w.add(`9,${y}`);
  return w;
})();
const ASTAR = (() => {
  const { cols, rows, start, goal } = GRID, key = (p) => `${p[0]},${p[1]}`;
  const h = (p) => Math.hypot(goal[0] - p[0], goal[1] - p[1]);
  const g = { [key(start)]: 0 }, from = {}, open = [start], closed = [], seen = new Set();
  while (open.length) {
    open.sort((a, b) => (g[key(a)] + h(a)) - (g[key(b)] + h(b)));
    const cur = open.shift(), ck = key(cur);
    if (seen.has(ck)) continue;
    seen.add(ck); closed.push(cur);
    if (ck === key(goal)) break;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) continue;
      const n = [cur[0] + dx, cur[1] + dy], nk = key(n);
      if (n[0] < 0 || n[1] < 0 || n[0] >= cols || n[1] >= rows || WALLS.has(nk)) continue;
      if (dx && dy && (WALLS.has(`${cur[0] + dx},${cur[1]}`) || WALLS.has(`${cur[0]},${cur[1] + dy}`))) continue; // no corner cutting
      const ng = g[ck] + Math.hypot(dx, dy);
      if (g[nk] === undefined || ng < g[nk]) { g[nk] = ng; from[nk] = cur; open.push(n); }
    }
  }
  const path = [goal]; let k = key(goal);
  while (from[k]) { path.unshift(from[k]); k = key(from[k]); }
  return { closed, path, len: g[key(goal)] };
})();

function Path({ T, C, th }) {
  const s = useScene(T, C, 'Path', 'Neighbors');
  if (!s.show) return null;
  const t0 = s.t0, { cols, rows, cell, start, goal } = GRID;
  const OX = 50, OY = 60;
  const X = (x) => OX + x * cell + cell / 2, Y = (y) => OY + (rows - 1 - y) * cell + cell / 2;
  const expand = prog(T, t0 + 1.2, t0 + 3.8), nShown = Math.floor(expand * ASTAR.closed.length);
  const pathP = MOTION.draw(prog(T, t0 + 3.9, t0 + 5.0));
  const walk = MOTION.draw(prog(T, t0 + 5.2, t0 + 9.6));
  const P = ASTAR.path, segs = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let dist = walk * total, pos = P[0];
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i]) { const q = dist / segs[i]; pos = [lerp(P[i][0], P[i + 1][0], q), lerp(P[i][1], P[i + 1][1], q)]; break; }
    dist -= segs[i]; pos = P[i + 1];
  }
  const hv = Math.hypot(goal[0] - pos[0], goal[1] - pos[1]);
  const pathStr = P.map((p) => `${X(p[0])},${Y(p[1])}`).join(' ');
  const pathLen = total * cell;
  const hO = prog(T, t0 + 5.0, t0 + 5.5);
  const cells = [];
  for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
    const wall = WALLS.has(`${x},${y}`);
    cells.push(<rect key={`${x},${y}`} x={OX + x * cell} y={OY + (rows - 1 - y) * cell} width={cell} height={cell}
      fill={wall ? th.faint : 'none'} fillOpacity={wall ? 0.55 : 0} stroke={th.grid} strokeWidth="1" />);
  }
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <Frame th={th} y={240} h={600}>
        <svg width={800} height={600} style={{ position: 'absolute', inset: 0 }}>
          {cells}
          {ASTAR.closed.slice(0, nShown).map((p, i) => <rect key={'c' + i} x={OX + p[0] * cell + 4} y={OY + (rows - 1 - p[1]) * cell + 4} width={cell - 8} height={cell - 8}
            fill={th.accent} fillOpacity={0.14} />)}
          <polyline points={pathStr} fill="none" stroke={th.accent} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - pathP)} />
          {hO > 0 && <line x1={X(pos[0])} y1={Y(pos[1])} x2={X(goal[0])} y2={Y(goal[1])} stroke={th.ink} strokeWidth="2" strokeDasharray="7 7" opacity={hO} />}
          <rect x={X(goal[0]) - 16} y={Y(goal[1]) - 16} width={32} height={32} fill="none" stroke={th.accent} strokeWidth="3" />
          <circle cx={X(pos[0])} cy={Y(pos[1])} r={15} fill={th.ink} stroke={th.bg} strokeWidth="3" />
        </svg>
        <div style={{ position: 'absolute', left: 24, top: 10, fontFamily: MONO, fontSize: 22, color: th.muted, opacity: prog(T, t0 + 1.0, t0 + 1.5) }}>
          explored {Math.min(nShown, ASTAR.closed.length)} cells</div>
        <div style={{ position: 'absolute', right: 24, top: 10, fontFamily: MONO, fontSize: 22, color: th.ink, opacity: hO, fontFeatureSettings: TNUM }}>
          h = {hv.toFixed(2)}</div>
      </Frame>
      <Column T={T} t0={t0} th={th} kicker="Pathfinding" title="A* search"
        note="A* ranks each step by the distance already traveled plus an estimate of the distance remaining.">
        <FLine T={T} at={t0 + 5.4} th={th} color={th.accent}>h = √(dx² + dy²)</FLine>
      </Column>
    </div>
  );
}

// ---------------- Neighbors (k-NN, k = 3) ----------------
const KNN = (() => {
  const r = rng(24), pts = [];
  const blob = (cx, cy, n, cls) => { for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.2; pts.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.9, cls }); } };
  blob(0.32, 0.36, 14, 'A');
  blob(0.68, 0.64, 14, 'B');
  const q = { x: 0.48, y: 0.47 };
  const ranked = pts.map((p, i) => ({ i, d: Math.hypot(p.x - q.x, p.y - q.y) })).sort((a, b) => a.d - b.d);
  const near = ranked.slice(0, 3);
  const votesA = near.filter((n) => pts[n.i].cls === 'A').length;
  return { pts, q, near, cls: votesA >= 2 ? 'A' : 'B', votes: Math.max(votesA, 3 - votesA) };
})();

function Neighbors({ T, C, th }) {
  const s = useScene(T, C, 'Neighbors', 'Terminal');
  if (!s.show) return null;
  const t0 = s.t0, FW = 788, FH = 588, PAD = 40;
  const X = (x) => PAD + x * (FW - 2 * PAD), Y = (y) => PAD + y * (FH - 2 * PAD);
  const sc = FW - 2 * PAD;
  const qP = MOTION.pop(prog(T, t0 + 2.2, t0 + 2.7));
  const ringR = KNN.near[2].d * sc * MOTION.draw(prog(T, t0 + 3.0, t0 + 5.0));
  const decided = prog(T, t0 + 6.6, t0 + 7.2);
  const isNear = new Set(KNN.near.map((n) => n.i));
  const fillFor = (cls) => cls === 'A' ? th.accent : 'none';
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <Frame th={th} y={240} h={600}>
        <svg width={FW} height={FH} style={{ position: 'absolute', inset: 0 }}>
          {ringR > 0 && <circle cx={X(KNN.q.x)} cy={Y(KNN.q.y)} r={ringR} fill={th.accent} fillOpacity={0.05} stroke={th.ink} strokeWidth="1.5" strokeDasharray="6 7" />}
          {KNN.near.map((n, k) => {
            const p = KNN.pts[n.i], lp = MOTION.draw(prog(T, t0 + 4.2 + k * 0.5, t0 + 4.9 + k * 0.5));
            return lp > 0 && <line key={k} x1={X(KNN.q.x)} y1={Y(KNN.q.y)} x2={lerp(X(KNN.q.x), X(p.x), lp)} y2={lerp(Y(KNN.q.y), Y(p.y), lp)} stroke={th.ink} strokeWidth="2" />;
          })}
          {KNN.pts.map((p, i) => {
            const o = MOTION.enter(prog(T, t0 + 0.6 + i * 0.04, t0 + 1.1 + i * 0.04));
            const hl = isNear.has(i) && T > t0 + 5.6;
            return <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={hl ? 13 : 10} fill={fillFor(p.cls)} fillOpacity={p.cls === 'A' ? 0.85 : 0}
              stroke={p.cls === 'A' ? th.accent : th.ink} strokeWidth={hl ? 3 : 2} opacity={o} />;
          })}
          {qP > 0 && <g>
            <rect x={X(KNN.q.x) - 13 * qP} y={Y(KNN.q.y) - 13 * qP} width={26 * qP} height={26 * qP} transform={`rotate(45 ${X(KNN.q.x)} ${Y(KNN.q.y)})`}
              fill={KNN.cls === 'A' ? th.accent : th.bg} fillOpacity={decided} stroke={th.ink} strokeWidth="2.5" />
          </g>}
        </svg>
        <div style={{ position: 'absolute', left: 20, bottom: 14, display: 'flex', gap: 28, fontFamily: BODY, fontSize: 20, color: th.muted, opacity: prog(T, t0 + 1.2, t0 + 1.8) }}>
          <span><span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: th.accent, marginRight: 8 }}></span>Class A</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 7, border: `2px solid ${th.ink}`, marginRight: 8 }}></span>Class B</span>
          <span><svg width="16" height="16" viewBox="0 0 16 16" style={{ marginRight: 8, verticalAlign: '-2px' }}><rect x="3.5" y="3.5" width="9" height="9" transform="rotate(45 8 8)" fill="none" stroke={th.ink} strokeWidth="1.8" /></svg>New point</span>
        </div>
      </Frame>
      <Column T={T} t0={t0} th={th} kicker="Machine learning" title="k-nearest neighbors"
        note="A new point is given the class held by most of its k closest neighbors, measured by Euclidean distance.">
        <FLine T={T} at={t0 + 5.4} th={th}>k = 3</FLine>
        <div style={{ opacity: prog(T, t0 + 5.8, t0 + 6.4), fontFamily: MONO, fontSize: 22, color: th.muted, fontFeatureSettings: TNUM }}>
          distances: {KNN.near.map((n) => (n.d * 10).toFixed(2)).join(', ')}</div>
        <FLine T={T} at={t0 + 6.6} th={th} color={th.accent}>{KNN.votes} of 3 neighbors: class {KNN.cls}</FLine>
      </Column>
    </div>
  );
}

// ---------------- Terminal ----------------
const PY = [
  ['in', '>>> from math import hypot, gcd'],
  ['in', '>>> hypot(3, 4)'],
  ['out', '5.0'],
  ['in', '>>> triples = [(a, b, c) for c in range(1, 101)'],
  ['in', '...            for b in range(1, c) for a in range(1, b)'],
  ['in', '...            if a*a + b*b == c*c]'],
  ['in', '>>> len(triples)'],
  ['out', '52'],
  ['in', '>>> sum(gcd(a, b) == 1 for a, b, c in triples)'],
  ['out', '16'],
  ['in', '>>> triples[:4]'],
  ['out', '[(3, 4, 5), (6, 8, 10), (5, 12, 13), (9, 12, 15)]'],
];
const PY_START = (() => { const s = [0]; PY.forEach(([k, t], i) => s.push(s[i] + (k === 'in' ? t.length * 0.018 + 0.15 : 0.25))); return s; })();
function Terminal({ T, C, th }) {
  const s = useScene(T, C, 'Terminal', 'Close');
  if (!s.show) return null;
  const t0 = s.t0, z = t0 + 1.0;
  const cursorOn = Math.floor((T - t0) * 2) % 2 === 0;
  const quake = prog(T, t0 + 5.4, t0 + 6.0);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <div style={{ position: 'absolute', left: 160, top: 240, width: 800, height: 600, boxSizing: 'border-box', background: '#141b30',
        border: `1px solid ${th.hair}`, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: `1px solid ${th.hair}` }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 6, border: `1.5px solid ${th.muted}` }}></span>)}
          <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 16, color: th.muted }}>python3</span>
        </div>
        <div style={{ padding: '18px 22px', fontFamily: MONO, fontSize: 21, lineHeight: 1.65, whiteSpace: 'pre' }}>
          {PY.map(([k, t], i) => {
            const a = z + PY_START[i], b = z + PY_START[i + 1];
            if (T < a) return null;
            const shown = k === 'in' ? t.slice(0, Math.max(0, Math.floor((T - a) / 0.018))) : t;
            const typing = k === 'in' && T < b && T >= a;
            return <div key={i} style={{ color: k === 'in' ? '#f2eef0' : '#f5d4f2' }}>{shown}{typing && cursorOn ? '▌' : ''}</div>;
          })}
        </div>
      </div>
      <Column T={T} t0={t0} th={th} kicker="Programming" title="The theorem in code"
        note="Python’s math.hypot returns √(x² + y²) and is written to avoid overflow with very large values.">
        <div style={{ opacity: quake, transform: `translateY(${12 * (1 - MOTION.enter(quake))}px)`, marginTop: 6, background: '#141b30', border: `1px solid ${th.hair}`, borderRadius: 6, padding: '16px 20px' }}>
          <div style={{ fontFamily: MONO, fontSize: 21, lineHeight: 1.6, color: '#f2eef0', whiteSpace: 'pre' }}>{'i = 0x5f3759df - (i >> 1);'}</div>
          <div style={{ marginTop: 8, fontFamily: BODY, fontSize: 26, lineHeight: 1.45, color: th.muted }}>Quake III Arena (1999). This line begins a fast approximation of 1/√(x² + y² + z²).</div>
        </div>
      </Column>
    </div>
  );
}

// ---------------- Close ----------------
function Close({ T, C, th }) {
  const t0 = C.Close;
  if (T < t0 - 0.3) return null;
  const h = prog(T, t0 - 0.2, t0 + 0.8), h2 = prog(T, t0 + 0.9, t0 + 1.7);
  const items = ['Collision detection', 'Pathfinding', 'Nearest neighbors', 'Graphics and lighting'];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, transform: `translateY(${16 * (1 - MOTION.enter(h))}px)`,
        fontFamily: SERIF, fontSize: 80, lineHeight: 1, color: th.ink }}><Words p={h}>{"Each of these measures distance."}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 450, textAlign: 'center', opacity: (h2) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 52, lineHeight: 1.1, color: th.accent }}><Words p={h2}>{"Each distance is a² + b² = c², in as many dimensions as the data has."}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', gap: 56 }}>
        {items.map((t, i) => {
          const p = prog(T, t0 + 1.8 + i * 0.25, t0 + 2.4 + i * 0.25);
          return <div key={t} style={{ opacity: MOTION.enter(p), transform: `translateY(${20 * (1 - MOTION.enter(p))}px)`, borderTop: `1px solid ${th.accent}`, paddingTop: 14,
            fontFamily: BODY, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: th.muted }}>{t}</div>;
        })}
      </div>
    </div>
  );
}

function CSPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 82.5;
  const fade = 1 - prog(T, end - 0.7, end - 0.05);
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.accent} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Opening T={T} C={CUES} th={th} />
        <Distance T={T} C={CUES} th={th} />
        <Collision T={T} C={CUES} th={th} />
        <Path T={T} C={CUES} th={th} />
        <Neighbors T={T} C={CUES} th={th} />
        <Terminal T={T} C={CUES} th={th} />
        <Close T={T} C={CUES} th={th} />
        {/* Distance */}<ShapeMorph T={T} at={CUES.Distance} k={0} cx={560} cy={550} color={th.accent} />
        {/* Collision */}<ShapeMorph T={T} at={CUES.Collision} k={1} cx={560} cy={550} color={th.accent} />
        {/* Path */}<ShapeMorph T={T} at={CUES.Path} k={2} cx={560} cy={550} color={th.accent} />
        {/* Neighbors */}<ShapeMorph T={T} at={CUES.Neighbors} k={3} cx={560} cy={550} color={th.accent} />
        {/* Terminal */}<ShapeMorph T={T} at={CUES.Terminal} k={4} cx={560} cy={550} color={th.accent} />
      </div>
    </div>
  );
}

function CSApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum' });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <CSPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

return CSPiece;
})(makeUse("V ", "Open", 82.5)) });

PIECES.push({ prefix: "VI ", first: "Open", total: 80.5, Piece: (function (useComposition) {
// Beyond the theorem — triples, irrational lengths, Fermat, the sphere, relativity. ~62s, 1920x1080, animations-v3.
const W = 1920, H = 1080;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
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
// handoffs: a glowing outline that morphs triangle → square → circle while it spins, bridging two scenes
const MORPH_N = 72;
const SHAPES = [
  [[-0.5, 0.33], [0.5, 0.33], [-0.5, -0.42]],
  [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  null,
].map((V) => {
  if (!V) return Array.from({ length: MORPH_N }, (_, i) => { const a = -Math.PI * 0.75 + (2 * Math.PI * i) / MORPH_N; return [0.5 * Math.cos(a), 0.5 * Math.sin(a)]; });
  const E = V.map((v, i) => [v, V[(i + 1) % V.length]]), len = E.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), total = len.reduce((x, y) => x + y, 0);
  return Array.from({ length: MORPH_N }, (_, i) => {
    let d = (i / MORPH_N) * total, j = 0;
    while (d > len[j]) { d -= len[j]; j++; }
    const [a, b] = E[j], t = d / len[j];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
});
function ShapeMorph({ T, at, k, cx, cy, size = 360, color }) {
  const q = Math.max(0, Math.min(1, (T - (at - 0.9)) / 1.8));
  if (q <= 0 || q >= 1) return null;
  const e = Easing.easeInOutCubic(q), A = SHAPES[k % 3], B = SHAPES[(k + 1) % 3];
  const s = size * (0.55 + 0.45 * Math.sin(Math.PI * q));
  const pts = A.map((p, i) => `${((p[0] + (B[i][0] - p[0]) * e) * s).toFixed(1)},${((p[1] + (B[i][1] - p[1]) * e) * s).toFixed(1)}`).join(' ');
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: Math.sin(Math.PI * q) }} aria-hidden="true">
      <g transform={`translate(${cx} ${cy}) rotate(${180 * e - 90})`}>
        <polygon points={pts} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" transform="scale(1.2)" />
      </g>
    </svg>
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
const THEMES = {
  Museum: { bg: '#202b48', card: '#26324f', ink: '#f2eef0', muted: '#b5b0ab', faint: '#857a9e', accent: '#f5d4f2', hair: 'rgba(181,176,171,0.35)', grid: 'rgba(181,176,171,0.16)' },
  Paper: { bg: '#f3f2f2', card: '#eae9e9', ink: '#201f1d', muted: '#605d5d', faint: '#9b9797', accent: '#7d5411', hair: 'rgba(32,31,29,0.18)', grid: 'rgba(32,31,29,0.10)' },
};
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif', TNUM = '"tnum"';
const DEG = Math.PI / 180;

function Reveal({ p, children, style }) {
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - 100 * MOTION.draw(p)}% -20% 0)`, opacity: p > 0 ? 1 : 0,
    transform: `perspective(700px) rotateX(${-70 * (1 - MOTION.enter(p))}deg)`, transformOrigin: '0% 100%' }}>{children}</div>;
}
function FLine({ T, at, th, color, size = 56, children }) {
  return <Reveal p={prog(T, at, at + 1.6)} style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.25, color: color || th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{children}</Reveal>;
}
function Column({ T, t0, th, kicker, title, note, noteAt = 0.9, children }) {
  return (
    <div style={{ position: 'absolute', left: 1040, top: 250, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ opacity: (prog(T, t0 + 0.3, t0 + 1.0)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent }}><Words p={prog(T, t0 + 0.3, t0 + 1.0)}>{kicker}</Words></div>
      <div style={{ opacity: (prog(T, t0 + 0.5, t0 + 1.3)) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 60, lineHeight: 1.05, color: th.ink, textWrap: 'balance' }}><Words p={prog(T, t0 + 0.5, t0 + 1.3)}>{title}</Words></div>
      <div style={{ opacity: (prog(T, t0 + noteAt, t0 + noteAt + 1.8)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 32, lineHeight: 1.45, color: th.muted, textWrap: 'pretty' }}><Words p={prog(T, t0 + noteAt, t0 + noteAt + 1.8)}>{note}</Words></div>
      <div style={{ height: 22, borderBottom: `1px solid ${th.hair}`, opacity: prog(T, t0 + 1.6, t0 + 2.2) }}></div>
      <div style={{ height: 6 }}></div>
      {children}
    </div>
  );
}
function useScene(T, C, name, next) {
  const t0 = C[name], t1 = C[next];
  const inP = prog(T, t0 - 0.2, t0 + 0.6), out = prog(T, t1 - 0.6, t1 - 0.05);
  const turn = 16 * (1 - MOTION.enter(inP)) - 16 * MOTION.draw(out), depth = -160 * (1 - MOTION.enter(inP)) - 160 * MOTION.draw(out);
  return { t0, t1, show: inP > 0 && out < 1, o: MOTION.enter(inP) * (1 - out), tf: `perspective(1600px) rotateY(${turn}deg) translateZ(${depth}px) scale(${0.78 + 0.22 * MOTION.enter(inP) - 0.22 * MOTION.draw(out)})` };
}
const tag = (th, txt, x, y, o, color, size = 30, italic = true) => o > 0 && (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o, fontFamily: SERIF, fontStyle: italic ? 'italic' : 'normal',
    fontSize: size, lineHeight: 1, color: color || th.ink, whiteSpace: 'nowrap', fontFeatureSettings: TNUM }}>{txt}</div>
);

// ---------------- Open ----------------
function Opening({ T, C, th }) {
  const out = prog(T, C.Triples - 0.7, C.Triples - 0.05);
  if (out >= 1) return null;
  const a = prog(T, 0.3, 1.3), b = prog(T, 1.0, 1.8);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: (a) > 0 ? 1 : 0, transform: `translateY(${20 * (1 - MOTION.enter(a))}px)`,
        fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: th.ink }}><Words p={a}>{"Beyond the theorem"}</Words></div>
      <div style={{ position: 'absolute', left: 340, right: 340, top: 540, textAlign: 'center', opacity: (b) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, lineHeight: 1.3, color: th.accent, textWrap: 'balance' }}><Words p={b}>{"The same relation leads to infinitely many triples, to irrational numbers, to Fermat, to curved space and to relativity."}</Words></div>
    </div>
  );
}

// ---------------- Triples: Euclid's formula ----------------
const PAIRS = [[2, 1], [3, 2], [4, 1], [4, 3], [5, 2], [5, 4]].map(([m, n]) => ({ m, n, a: m * m - n * n, b: 2 * m * n, c: m * m + n * n }));
function Triples({ T, C, th }) {
  const s = useScene(T, C, 'Triples', 'Spiral');
  if (!s.show) return null;
  const t0 = s.t0, STEP = 1.15, z = t0 + 1.4;
  const f = Math.max(0, Math.min(PAIRS.length - 1, (T - z) / STEP));
  const i = Math.floor(f), q = MOTION.draw(cl((f - i) / 0.45));
  const cur = PAIRS[i], nxt = PAIRS[Math.min(i + 1, PAIRS.length - 1)];
  const BOX = 470, sc = (p) => BOX / Math.max(p.a, p.b);
  const wA = lerp(cur.a * sc(cur), nxt.a * sc(nxt), q), hB = lerp(cur.b * sc(cur), nxt.b * sc(nxt), q);
  const OX = 300, OY = 760;
  const shown = T >= z ? Math.min(PAIRS.length, Math.floor((T - z) / STEP + 0.45) + 1) : 0;
  const disp = q > 0.5 ? nxt : cur;
  const o = prog(T, t0 + 0.8, t0 + 1.4);
  const k = (txt, v, x, y) => (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: SERIF, fontSize: 44, color: th.ink, fontFeatureSettings: TNUM, opacity: o }}>
      <span style={{ fontStyle: 'italic', color: th.muted }}>{txt}</span> = {v}</div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <polygon points={`${OX},${OY} ${OX + wA},${OY} ${OX},${OY - hB}`} fill={th.accent} fillOpacity="0.22" stroke={th.accent} strokeWidth="3" strokeLinejoin="round" opacity={o} />
        <polyline points={`${OX + 18},${OY} ${OX + 18},${OY - 18} ${OX},${OY - 18}`} fill="none" stroke={th.accent} strokeWidth="2" opacity={o} />
      </svg>
      {tag(th, `a = ${disp.a}`, OX + wA / 2, OY + 34, o, th.ink, 34)}
      {tag(th, `b = ${disp.b}`, OX - 70, OY - hB / 2, o, th.ink, 34)}
      {tag(th, `c = ${disp.c}`, OX + wA / 2 + 70, OY - hB / 2 - 20, o, th.accent, 34)}
      {k('m', disp.m, 620, 300)}
      {k('n', disp.n, 620, 360)}
      <div style={{ position: 'absolute', left: 160, top: 860, display: 'flex', gap: 30, fontFamily: SERIF, fontSize: 34, color: th.muted, fontFeatureSettings: TNUM }}>
        {PAIRS.map((p, j) => <span key={j} style={{ opacity: j < shown ? 1 : 0, color: j === (q > 0.5 ? Math.min(i + 1, PAIRS.length - 1) : i) && j < shown ? th.accent : th.muted }}>{p.a}-{p.b}-{p.c}</span>)}
      </div>
      <Column T={T} t0={t0} th={th} kicker="Generating triples" title="Euclid’s formula"
        note="Any whole numbers m > n > 0 give a Pythagorean triple.">
        <FLine T={T} at={t0 + 3.0} th={th}>a = m² − n²</FLine>
        <FLine T={T} at={t0 + 3.8} th={th}>b = 2mn</FLine>
        <FLine T={T} at={t0 + 4.6} th={th} color={th.accent}>c = m² + n²</FLine>
      </Column>
    </div>
  );
}

// ---------------- Spiral of Theodorus ----------------
const SPIRAL = (() => {
  const P = [[1, 0]]; let th = 0;
  for (let k = 1; k <= 16; k++) { th += Math.atan(1 / Math.sqrt(k)); const r = Math.sqrt(k + 1); P.push([r * Math.cos(th), r * Math.sin(th)]); }
  return P;
})();
function Spiral({ T, C, th }) {
  const s = useScene(T, C, 'Spiral', 'Fermat');
  if (!s.show) return null;
  const t0 = s.t0, CX = 560, CY = 560, U = 84;
  const X = (p) => CX + p[0] * U, Y = (p) => CY - p[1] * U;
  const at = (k) => t0 + 1.2 + (k - 1) * 0.4;
  const tris = [];
  for (let k = 1; k <= 16; k++) {
    const p = prog(T, at(k), at(k) + 0.5);
    if (p <= 0) continue;
    const A = SPIRAL[k - 1], B = SPIRAL[k];
    const Bq = [lerp(A[0], B[0], MOTION.draw(p)), lerp(A[1], B[1], MOTION.draw(p))];
    tris.push(<polygon key={k} points={`${CX},${CY} ${X(A)},${Y(A)} ${X(Bq)},${Y(Bq)}`} fill={th.accent} fillOpacity={k === 1 ? 0.45 : (k % 2 ? 0.16 : 0.3)}
      stroke={th.accent} strokeWidth="1.5" strokeLinejoin="round" />);
  }
  const labels = SPIRAL.slice(1).map((p, j) => {
    const k = j + 1, o = prog(T, at(k) + 0.4, at(k) + 0.8), r = Math.hypot(p[0], p[1]);
    return tag(th, `√${k + 1}`, X([p[0] * (1 + 0.42 / r), 0]), Y([0, p[1] * (1 + 0.42 / r)]), o, k === 1 ? th.accent : th.ink, 26, false);
  });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={CX} y1={CY} x2={X(SPIRAL[0])} y2={Y(SPIRAL[0])} stroke={th.ink} strokeWidth="2" opacity={prog(T, t0 + 0.6, t0 + 1.0)} />
        {tris}
        <circle cx={CX} cy={CY} r="4" fill={th.ink} />
      </svg>
      {tag(th, '1', X([0.5, 0]), Y([0, -0.22]), prog(T, t0 + 0.8, t0 + 1.2), th.muted, 26, false)}
      {labels}
      <Column T={T} t0={t0} th={th} kicker="Irrational lengths" title="The spiral of Theodorus"
        note="Each triangle has an outer side of 1 and stands on the hypotenuse of the one before, so the hypotenuses measure √2, √3, √4, √5 and so on.">
        <FLine T={T} at={t0 + 4.0} th={th}>1² + 1² = (√2)²</FLine>
        <FLine T={T} at={t0 + 5.2} th={th} color={th.accent}>(√n)² + 1² = (√(n + 1))²</FLine>
      </Column>
    </div>
  );
}

// ---------------- Fermat ----------------
const NEAR = [
  ['6³ + 8³', '728', '9³', '729'],
  ['9³ + 10³', '1,729', '12³', '1,728'],
  ['71³ + 138³', '2,985,983', '144³', '2,985,984'],
];
function Fermat({ T, C, th }) {
  const s = useScene(T, C, 'Fermat', 'Sphere');
  if (!s.show) return null;
  const t0 = s.t0;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <div style={{ position: 'absolute', left: 160, top: 250, width: 800, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ fontFamily: BODY, fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.muted, opacity: prog(T, t0 + 1.0, t0 + 1.6) }}>Near misses: each sum lies one away from a cube</div>
        {NEAR.map(([l, lv, r, rv], j) => {
          const p = prog(T, t0 + 1.6 + j * 1.6, t0 + 2.3 + j * 1.6), neq = prog(T, t0 + 2.4 + j * 1.6, t0 + 2.9 + j * 1.6);
          return (
            <div key={j} style={{ opacity: MOTION.enter(p), transform: `translateY(${16 * (1 - MOTION.enter(p))}px)`, background: th.card, border: `1px solid ${th.hair}`, borderRadius: 4,
              padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 50px 1fr', alignItems: 'center', fontFamily: SERIF, fontSize: 34, color: th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>
              <div><span>{l}</span><span style={{ color: th.muted }}> = {lv}</span></div>
              <div style={{ textAlign: 'center', fontSize: 52, color: th.accent, opacity: neq }}>≠</div>
              <div style={{ textAlign: 'right' }}><span>{r}</span><span style={{ color: th.muted }}> = {rv}</span></div>
            </div>
          );
        })}
      </div>
      <Column T={T} t0={t0} th={th} kicker="Number theory · 1637 to 1994" title="Fermat’s Last Theorem"
        note="Around 1637 Pierre de Fermat wrote in a book margin that cubes and higher powers admit none. Andrew Wiles proved the statement in 1994.">
        <FLine T={T} at={t0 + 5.0} th={th}>a² + b² = c²   infinitely many</FLine>
        <FLine T={T} at={t0 + 6.0} th={th} color={th.accent}>aⁿ + bⁿ = cⁿ   none for n &gt; 2</FLine>
      </Column>
    </div>
  );
}

// ---------------- Sphere ----------------
function project(lat, lon, lat0, lon0, R) {
  const f = lat * DEG, l = (lon - lon0) * DEG, f0 = lat0 * DEG;
  const x = R * Math.cos(f) * Math.sin(l);
  const y = R * (Math.cos(f0) * Math.sin(f) - Math.sin(f0) * Math.cos(f) * Math.cos(l));
  const z = Math.sin(f0) * Math.sin(f) + Math.cos(f0) * Math.cos(f) * Math.cos(l);
  return [x, y, z];
}
// split a sampled lat/lon path into visible screen polylines
function pathPolys(samples, lat0, lon0, R, CX, CY) {
  const out = []; let cur = [];
  samples.forEach(([la, lo]) => {
    const [x, y, z] = project(la, lo, lat0, lon0, R);
    if (z >= 0) cur.push(`${CX + x},${CY - y}`); else if (cur.length) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
}
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
const TRI_PATH = [
  ...range(90, 0, 60).map((la) => [la, 0]),
  ...range(0, 90, 60).map((lo) => [0, lo]),
  ...range(0, 90, 60).map((la) => [la, 90]),
];
function Sphere({ T, C, th }) {
  const s = useScene(T, C, 'Sphere', 'Relativity');
  if (!s.show) return null;
  const t0 = s.t0, CX = 560, CY = 570, R = 300, lat0 = 28;
  const lon0 = lerp(15, 75, prog(T, t0, s.t1));
  const graticule = [];
  for (let lo = -180; lo < 180; lo += 30) graticule.push(...pathPolys(range(-90, 90, 72).map((la) => [la, lo]), lat0, lon0, R, CX, CY));
  for (let la = -60; la <= 60; la += 30) graticule.push(...pathPolys(range(-180, 180, 144).map((lo) => [la, lo]), lat0, lon0, R, CX, CY));
  const drawP = prog(T, t0 + 1.6, t0 + 4.6), nShow = Math.floor(drawP * TRI_PATH.length);
  const triPolys = pathPolys(TRI_PATH.slice(0, Math.max(2, nShow)), lat0, lon0, R, CX, CY);
  const fillO = prog(T, t0 + 4.4, t0 + 5.0);
  const fillPolys = fillO > 0 ? pathPolys(TRI_PATH, lat0, lon0, R, CX, CY) : [];
  const vtx = (la, lo, t) => { const [x, y, z] = project(la, lo, lat0, lon0, R); return z > 0 && tag(th, '90°', CX + x, CY - y, prog(T, t, t + 0.5), th.accent, 32, false); };
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={CX} cy={CY} r={R} fill={th.card} stroke={th.hair} strokeWidth="1.5" opacity={prog(T, t0 + 0.4, t0 + 1.0)} />
        {graticule.map((pl, j) => <polyline key={j} points={pl.join(' ')} fill="none" stroke={th.grid} strokeWidth="1.2" opacity={prog(T, t0 + 0.6, t0 + 1.4)} />)}
        {fillPolys.map((pl, j) => <polygon key={'f' + j} points={pl.join(' ')} fill={th.accent} fillOpacity={0.2 * fillO} stroke="none" />)}
        {T > t0 + 1.6 && triPolys.map((pl, j) => <polyline key={'t' + j} points={pl.join(' ')} fill="none" stroke={th.accent} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />)}
      </svg>
      {vtx(80, 45, t0 + 5.0)}
      {vtx(9, 9, t0 + 5.4)}
      {vtx(9, 81, t0 + 5.8)}
      {tag(th, 'North Pole', ...(() => { const [x, y] = project(90, 0, lat0, lon0, R); return [CX + x, CY - y - 34]; })(), prog(T, t0 + 1.2, t0 + 1.8), th.muted, 24)}
      {tag(th, 'Equator', ...(() => { const [x, y] = project(0, 45, lat0, lon0, R); return [CX + x, CY - y + 36]; })(), prog(T, t0 + 4.0, t0 + 4.6), th.muted, 24)}
      <Column T={T} t0={t0} th={th} kicker="Non-Euclidean geometry" title="Where the theorem does not hold"
        note="On a sphere, a triangle from the North Pole to two points on the equator a quarter turn apart has three right angles.">
        <FLine T={T} at={t0 + 6.2} th={th} color={th.accent}>90° + 90° + 90° = 270°</FLine>
      </Column>
    </div>
  );
}

// ---------------- Relativity ----------------
function Relativity({ T, C, th }) {
  const s = useScene(T, C, 'Relativity', 'Close');
  if (!s.show) return null;
  const t0 = s.t0, OX = 300, OY = 780, MC = 380;
  const draw = MOTION.draw(prog(T, t0 + 0.8, t0 + 2.0));
  const pc = 460 * (1 - MOTION.draw(prog(T, t0 + 4.4, t0 + 7.0)));
  const E = Math.hypot(pc, MC);
  const top = [OX, OY - MC], right = [OX + pc, OY];
  const lo = prog(T, t0 + 1.8, t0 + 2.4);
  const done = prog(T, t0 + 6.8, t0 + 7.3);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g opacity={draw}>
          <polygon points={`${OX},${OY} ${right[0]},${right[1]} ${top[0]},${top[1]}`} fill={th.accent} fillOpacity="0.18" stroke="none" />
          <line x1={OX} y1={OY} x2={OX} y2={OY - MC} stroke={th.ink} strokeWidth="3" />
          <line x1={OX} y1={OY} x2={right[0]} y2={OY} stroke={th.ink} strokeWidth="3" />
          <line x1={right[0]} y1={right[1]} x2={top[0]} y2={top[1]} stroke={th.accent} strokeWidth="4" />
          {pc > 30 && <polyline points={`${OX + 20},${OY} ${OX + 20},${OY - 20} ${OX},${OY - 20}`} fill="none" stroke={th.ink} strokeWidth="1.5" />}
        </g>
      </svg>
      {tag(th, 'mc²', OX - 60, OY - MC / 2, lo, th.ink, 40)}
      {tag(th, 'pc', OX + pc / 2, OY + 36, lo * cl(pc / 60), th.ink, 40)}
      {tag(th, 'E', (right[0] + top[0]) / 2 + 30 + 20 * cl(pc / 100), (right[1] + top[1]) / 2 - 24, lo * (1 - done), th.accent, 44)}
      {tag(th, 'E = mc²', OX + 130, OY - MC / 2, done, th.accent, 56, false)}
      <div style={{ position: 'absolute', left: 160, top: 880, fontFamily: BODY, fontSize: 22, color: th.muted, opacity: prog(T, t0 + 4.2, t0 + 4.8) * (1 - done * 0.4) }}>
        Momentum decreases to zero: the particle comes to rest.</div>
      <Column T={T} t0={t0} th={th} kicker="Special relativity" title="Energy, momentum and mass"
        note="A particle’s energy E, momentum p and rest mass m satisfy the relation of a right triangle.">
        <FLine T={T} at={t0 + 2.6} th={th}>E² = (pc)² + (mc²)²</FLine>
        <FLine T={T} at={t0 + 7.4} th={th} color={th.accent}>p = 0:  E = mc²</FLine>
      </Column>
    </div>
  );
}

// ---------------- Close ----------------
function Close({ T, C, th }) {
  const t0 = C.Close;
  if (T < t0 - 0.3) return null;
  const h = prog(T, t0 - 0.2, t0 + 0.8), h2 = prog(T, t0 + 1.0, t0 + 1.9);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, transform: `translateY(${16 * (1 - MOTION.enter(h))}px)`,
        fontFamily: SERIF, fontSize: 80, lineHeight: 1, color: th.ink }}><Words p={h}>{"From a clay tablet to relativity, one relation."}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: h2, transform: `scale(${0.92 + 0.08 * MOTION.pop(h2)})`,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 120, lineHeight: 1, color: th.accent }}>a² + b² = c²</div>
    </div>
  );
}

function BeyondPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 80.5;
  const fade = 1 - prog(T, end - 0.7, end - 0.05);
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.accent} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Opening T={T} C={CUES} th={th} />
        <Triples T={T} C={CUES} th={th} />
        <Spiral T={T} C={CUES} th={th} />
        <Fermat T={T} C={CUES} th={th} />
        <Sphere T={T} C={CUES} th={th} />
        <Relativity T={T} C={CUES} th={th} />
        <Close T={T} C={CUES} th={th} />
        {/* Triples */}<ShapeMorph T={T} at={CUES.Triples} k={0} cx={560} cy={560} color={th.accent} />
        {/* Spiral */}<ShapeMorph T={T} at={CUES.Spiral} k={1} cx={560} cy={560} color={th.accent} />
        {/* Fermat */}<ShapeMorph T={T} at={CUES.Fermat} k={2} cx={560} cy={560} color={th.accent} />
        {/* Sphere */}<ShapeMorph T={T} at={CUES.Sphere} k={3} cx={560} cy={560} color={th.accent} />
        {/* Relativity */}<ShapeMorph T={T} at={CUES.Relativity} k={4} cx={560} cy={560} color={th.accent} />
      </div>
    </div>
  );
}

function BeyondApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum' });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <BeyondPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

return BeyondPiece;
})(makeUse("VI ", "Open", 80.5)) });

PIECES.push({ prefix: "VII ", first: "Open", total: 84, Piece: (function (useComposition) {
// Curiosities — the Pythagoreans, music, √2, number facts, the theorem on screen. ~65.5s, 1920x1080, animations-v3.
const W = 1920, H = 1080;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
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
// handoffs: a glowing outline that morphs triangle → square → circle while it spins, bridging two scenes
const MORPH_N = 72;
const SHAPES = [
  [[-0.5, 0.33], [0.5, 0.33], [-0.5, -0.42]],
  [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  null,
].map((V) => {
  if (!V) return Array.from({ length: MORPH_N }, (_, i) => { const a = -Math.PI * 0.75 + (2 * Math.PI * i) / MORPH_N; return [0.5 * Math.cos(a), 0.5 * Math.sin(a)]; });
  const E = V.map((v, i) => [v, V[(i + 1) % V.length]]), len = E.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), total = len.reduce((x, y) => x + y, 0);
  return Array.from({ length: MORPH_N }, (_, i) => {
    let d = (i / MORPH_N) * total, j = 0;
    while (d > len[j]) { d -= len[j]; j++; }
    const [a, b] = E[j], t = d / len[j];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
});
function ShapeMorph({ T, at, k, cx, cy, size = 360, color }) {
  const q = Math.max(0, Math.min(1, (T - (at - 0.9)) / 1.8));
  if (q <= 0 || q >= 1) return null;
  const e = Easing.easeInOutCubic(q), A = SHAPES[k % 3], B = SHAPES[(k + 1) % 3];
  const s = size * (0.55 + 0.45 * Math.sin(Math.PI * q));
  const pts = A.map((p, i) => `${((p[0] + (B[i][0] - p[0]) * e) * s).toFixed(1)},${((p[1] + (B[i][1] - p[1]) * e) * s).toFixed(1)}`).join(' ');
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: Math.sin(Math.PI * q) }} aria-hidden="true">
      <g transform={`translate(${cx} ${cy}) rotate(${180 * e - 90})`}>
        <polygon points={pts} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" transform="scale(1.2)" />
      </g>
    </svg>
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
const THEMES = {
  Museum: { bg: '#202b48', card: '#26324f', ink: '#f2eef0', muted: '#b5b0ab', faint: '#857a9e', accent: '#f5d4f2', hair: 'rgba(181,176,171,0.35)' },
  Paper: { bg: '#f3f2f2', card: '#eae9e9', ink: '#201f1d', muted: '#605d5d', faint: '#9b9797', accent: '#7d5411', hair: 'rgba(32,31,29,0.18)' },
};
const SERIF = '"Cormorant Garamond", Georgia, serif', BODY = '"Lora", Georgia, serif', TNUM = '"tnum"';
const PLATE_FILTER = 'sepia(0.22) saturate(0.82) contrast(1.05)';
const BUST = 'images/pythagoras-bust.jpg';

function Reveal({ p, children, style }) {
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - 100 * MOTION.draw(p)}% -20% 0)`, opacity: p > 0 ? 1 : 0,
    transform: `perspective(700px) rotateX(${-70 * (1 - MOTION.enter(p))}deg)`, transformOrigin: '0% 100%' }}>{children}</div>;
}
function FLine({ T, at, th, color, size = 56, children }) {
  return <Reveal p={prog(T, at, at + 1.6)} style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.25, color: color || th.ink, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>{children}</Reveal>;
}
function Column({ T, t0, th, kicker, title, note, noteAt = 0.9, top = 250, children }) {
  return (
    <div style={{ position: 'absolute', left: 1040, top, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ opacity: (prog(T, t0 + 0.3, t0 + 1.0)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent }}><Words p={prog(T, t0 + 0.3, t0 + 1.0)}>{kicker}</Words></div>
      <div style={{ opacity: (prog(T, t0 + 0.5, t0 + 1.3)) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 60, lineHeight: 1.05, color: th.ink, textWrap: 'balance' }}><Words p={prog(T, t0 + 0.5, t0 + 1.3)}>{title}</Words></div>
      <div style={{ opacity: (prog(T, t0 + noteAt, t0 + noteAt + 1.8)) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 32, lineHeight: 1.45, color: th.muted, textWrap: 'pretty' }}><Words p={prog(T, t0 + noteAt, t0 + noteAt + 1.8)}>{note}</Words></div>
      <div style={{ height: 22, borderBottom: `1px solid ${th.hair}`, opacity: prog(T, t0 + 1.6, t0 + 2.2) }}></div>
      <div style={{ height: 6 }}></div>
      {children}
    </div>
  );
}
function useScene(T, C, name, next) {
  const t0 = C[name], t1 = C[next];
  const inP = prog(T, t0 - 0.2, t0 + 0.6), out = prog(T, t1 - 0.6, t1 - 0.05);
  const turn = 16 * (1 - MOTION.enter(inP)) - 16 * MOTION.draw(out), depth = -160 * (1 - MOTION.enter(inP)) - 160 * MOTION.draw(out);
  return { t0, t1, show: inP > 0 && out < 1, o: MOTION.enter(inP) * (1 - out), tf: `perspective(1600px) rotateY(${turn}deg) translateZ(${depth}px) scale(${0.78 + 0.22 * MOTION.enter(inP) - 0.22 * MOTION.draw(out)})` };
}
const tag = (th, txt, x, y, o, color, size = 30, italic = true) => o > 0 && (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o, fontFamily: SERIF, fontStyle: italic ? 'italic' : 'normal',
    fontSize: size, lineHeight: 1, color: color || th.ink, whiteSpace: 'nowrap', fontFeatureSettings: TNUM }}>{txt}</div>
);

// ---------------- Open ----------------
function Opening({ T, C, th }) {
  const out = prog(T, C.School - 0.7, C.School - 0.05);
  if (out >= 1) return null;
  const a = prog(T, 0.3, 1.3), b = prog(T, 1.0, 1.8);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: (a) > 0 ? 1 : 0, transform: `translateY(${20 * (1 - MOTION.enter(a))}px)`,
        fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: th.ink }}><Words p={a}>{"Curiosities"}</Words></div>
      <div style={{ position: 'absolute', left: 360, right: 360, top: 540, textAlign: 'center', opacity: (b) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, lineHeight: 1.3, color: th.accent, textWrap: 'balance' }}><Words p={b}>{"The school, the music and the numbers that surround a² + b² = c²."}</Words></div>
    </div>
  );
}

// ---------------- School ----------------
function School({ T, C, th }) {
  const s = useScene(T, C, 'School', 'Music');
  if (!s.show) return null;
  const t0 = s.t0, p = prog(T, t0 + 0.4, t0 + 1.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <div style={{ position: 'absolute', left: 300, top: 220, width: 460, opacity: MOTION.enter(p), transform: `translateY(${24 * (1 - MOTION.enter(p))}px) scale(${1 + 0.03 * prog(T, t0, s.t1)})`, transformOrigin: '50% 40%' }}>
        <img src={BUST} style={{ width: 460, height: 560, objectFit: 'cover', objectPosition: '50% 20%', filter: PLATE_FILTER, boxSizing: 'border-box',
          border: `6px solid ${th.card}`, outline: `1px solid ${th.hair}`, display: 'block' }} />
        <div style={{ marginTop: 14, fontFamily: BODY, fontStyle: 'italic', fontSize: 22, lineHeight: 1.4, color: th.muted }}>Bust of Pythagoras. Roman copy of a Greek original, Capitoline Museums, Rome.</div>
      </div>
      <Column T={T} t0={t0} th={th} kicker="Croton, southern Italy · c. 530 BC" title="The Pythagoreans"
        note="Pythagoras settled in Croton and founded a community devoted to mathematics, music and a strict way of life.">
        <FLine T={T} at={t0 + 5.2} th={th} color={th.accent}>“All is number.”</FLine>
        <div style={{ opacity: prog(T, t0 + 6.4, t0 + 7.0), fontFamily: BODY, fontSize: 22, color: th.muted }}>The teaching attributed to the school by later writers, among them Aristotle.</div>
      </Column>
    </div>
  );
}

// ---------------- Music: the monochord ----------------
const RATIOS = [
  { frac: 1, label: '1 : 1', name: 'Unison' },
  { frac: 1 / 2, label: '2 : 1', name: 'Octave' },
  { frac: 2 / 3, label: '3 : 2', name: 'Fifth' },
  { frac: 3 / 4, label: '4 : 3', name: 'Fourth' },
];
function Music({ T, C, th }) {
  const s = useScene(T, C, 'Music', 'Root2');
  if (!s.show) return null;
  const t0 = s.t0, X0 = 180, X1 = 920, L = X1 - X0;
  const rows = RATIOS.map((r, i) => {
    const y = 330 + i * 140, p = prog(T, t0 + 1.2 + i * 1.5, t0+ 1.8 + i * 1.5);
    if (p <= 0) return null;
    const len = L * r.frac, bridge = X0 + len;
    const amp = 18 * Math.max(0, 1 - (T - (t0 + 1.8 + i * 1.5)) / 3) * MOTION.enter(p);
    const k = 2 * Math.PI * (1 / r.frac) * 3.2;
    const wave = Array.from({ length: 61 }, (_, j) => {
      const u = j / 60, x = X0 + u * len;
      return `${x},${y + amp * Math.sin(Math.PI * u) * Math.sin(k * (T - t0))}`;
    }).join(' ');
    return (
      <g key={i} opacity={MOTION.enter(p)}>
        <line x1={X0} y1={y} x2={X1} y2={y} stroke={th.hair} strokeWidth="2" />
        <polyline points={wave} fill="none" stroke={th.accent} strokeWidth="3" />
        <rect x={X0 - 8} y={y - 22} width="8" height="44" fill={th.ink} />
        <path d={`M ${bridge - 10} ${y + 22} L ${bridge} ${y - 4} L ${bridge + 10} ${y + 22} Z`} fill={th.ink} />
      </g>
    );
  });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>{rows}</svg>
      {RATIOS.map((r, i) => {
        const o = prog(T, t0 + 1.6 + i * 1.5, t0 + 2.1 + i * 1.5), y = 330 + i * 140;
        return o > 0 && (
          <div key={i} style={{ position: 'absolute', left: X0, top: y - 74, width: L, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity: o }}>
            <span style={{ fontFamily: BODY, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.muted }}>{r.name}</span>
            <span style={{ fontFamily: SERIF, fontSize: 34, color: i ? th.accent : th.ink, fontFeatureSettings: TNUM }}>{r.label}</span>
          </div>
        );
      })}
      <Column T={T} t0={t0} th={th} kicker="Music" title="Harmony as ratio"
        note="The Pythagoreans linked musical consonance to simple ratios of string length.">
        <FLine T={T} at={t0 + 7.6} th={th}>2 : 1 · 3 : 2 · 4 : 3</FLine>
      </Column>
    </div>
  );
}

// ---------------- Root 2 and Hippasus ----------------
const ROOT2 = '1.41421356237309504880168872420969807856967187537694';
function Root2({ T, C, th }) {
  const s = useScene(T, C, 'Root2', 'Numbers');
  if (!s.show) return null;
  const t0 = s.t0, X = 260, Y = 760, S = 420;
  const sq = MOTION.draw(prog(T, t0 + 0.6, t0 + 1.8)), dg = MOTION.draw(prog(T, t0 + 2.0, t0 + 3.0));
  const per = 4 * S, dLen = S * Math.SQRT2;
  const nDig = Math.floor(lerp(0, ROOT2.length, prog(T, t0 + 3.4, t0 + 8.4)));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <polygon points={`${X},${Y} ${X + S},${Y} ${X + S},${Y - S} ${X},${Y - S}`} fill={th.card} stroke={th.ink} strokeWidth="2.5"
          strokeDasharray={per} strokeDashoffset={per * (1 - sq)} />
        <line x1={X} y1={Y} x2={X + S * dg} y2={Y - S * dg} stroke={th.accent} strokeWidth="4" strokeDasharray={dLen} />
      </svg>
      {tag(th, '1', X + S / 2, Y + 32, prog(T, t0 + 1.4, t0 + 1.9), th.muted, 34, false)}
      {tag(th, '1', X - 30, Y - S / 2, prog(T, t0 + 1.6, t0 + 2.1), th.muted, 34, false)}
      {tag(th, '√2', X + S / 2 - 46, Y - S / 2 - 40, prog(T, t0 + 2.8, t0 + 3.3), th.accent, 48)}
      <div style={{ position: 'absolute', left: 160, top: 840, width: 820, fontFamily: SERIF, fontSize: 34, color: th.ink, fontFeatureSettings: TNUM, wordBreak: 'break-all', lineHeight: 1.3, opacity: prog(T, t0 + 3.2, t0 + 3.6) }}>
        {ROOT2.slice(0, nDig)}{nDig >= ROOT2.length ? '…' : ''}</div>
      <Column T={T} t0={t0} th={th} kicker="The irrational" title="The diagonal of the square"
        note="A square with sides of 1 has a diagonal of √2, a length that no fraction can express. Later accounts say the Pythagorean Hippasus revealed this and was drowned at sea. Historians regard the story as legend.">
        <FLine T={T} at={t0 + 4.4} th={th}>1² + 1² = 2</FLine>
        <FLine T={T} at={t0 + 5.6} th={th} color={th.accent}>√2 ≠ p / q</FLine>
      </Column>
    </div>
  );
}

// ---------------- Numbers ----------------
// the worked products in the third fact use no-break spaces, so no line starts with · or =
const FACTS = [
  { tri: [3, 4, 5], kicker: 'Consecutive', title: '3, 4, 5', text: 'The only Pythagorean triple made of three consecutive whole numbers.' },
  { tri: [5, 12, 13], kicker: 'Area equals perimeter', title: '5-12-13 and 6-8-10', text: 'The only right triangles with whole-number sides whose area equals their perimeter: 30 and 24.' },
  { tri: [8, 15, 17], kicker: 'Divisible by 60', title: 'a · b · c', text: 'The product of the three sides of any Pythagorean triple is a multiple of 60: 3 · 4 · 5 = 60, 8 · 15 · 17 = 2,040.' },
];
function Numbers({ T, C, th }) {
  const s = useScene(T, C, 'Numbers', 'Screen');
  if (!s.show) return null;
  const t0 = s.t0;
  const h = prog(T, t0 + 0.2, t0 + 0.9);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent }}><Words p={h}>{"Number curiosities"}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 64, color: th.ink }}><Words p={h}>{"Properties of whole-number triples"}</Words></div>
      <div style={{ position: 'absolute', left: 160, right: 160, top: 360, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 40 }}>
        {FACTS.map((f, i) => {
          const p = prog(T, t0 + 1.2 + i * 2.2, t0 + 1.9 + i * 2.2);
          const [a, b] = f.tri, sc = 220 / Math.max(a, b), w = b * sc, hh = a * sc;
          const dp = MOTION.draw(prog(T, t0 + 1.6 + i * 2.2, t0 + 2.6 + i * 2.2));
          const per = w + hh + Math.hypot(w, hh);
          return (
            <div key={i} style={{ height: 500, boxSizing: 'border-box', padding: '30px 32px', background: th.card, border: `1px solid ${th.hair}`, borderRadius: 4,
              opacity: MOTION.enter(p), transform: `translateY(${24 * (1 - MOTION.enter(p))}px)`, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <svg width="100%" height="230" viewBox="0 0 460 250" style={{ flexShrink: 0 }}>
                <polygon points={`${230 - w / 2},${235} ${230 + w / 2},${235} ${230 - w / 2},${235 - hh}`} fill={th.accent} fillOpacity="0.2" stroke={th.accent} strokeWidth="3"
                  strokeLinejoin="round" strokeDasharray={per} strokeDashoffset={per * (1 - dp)} />
              </svg>
              <div style={{ fontFamily: BODY, fontSize: 20, letterSpacing: '0.16em', textTransform: 'uppercase', color: th.accent }}>{f.kicker}</div>
              <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1.05, color: th.ink, fontFeatureSettings: TNUM }}>{f.title}</div>
              <div style={{ fontFamily: BODY, fontSize: 23, lineHeight: 1.5, color: th.muted, fontFeatureSettings: TNUM }}>{f.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- On screen ----------------
const SCREEN = [
  { year: '1939', title: 'The Wizard of Oz', text: 'After receiving a diploma, the Scarecrow recites the theorem incorrectly, speaking of square roots and of an isosceles triangle.' },
  { year: '1959', title: 'Donald in Mathmagic Land', text: 'A Walt Disney short in which Donald Duck meets Pythagoras and the ratios of the musical scale. It was nominated for an Academy Award.' },
];
function Screen({ T, C, th }) {
  const s = useScene(T, C, 'Screen', 'Close');
  if (!s.show) return null;
  const t0 = s.t0, h = prog(T, t0 + 0.2, t0 + 0.9);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, fontFamily: BODY, fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: th.accent }}><Words p={h}>{"Popular culture"}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, fontFamily: SERIF, fontSize: 64, color: th.ink }}><Words p={h}>{"The theorem on screen"}</Words></div>
      <div style={{ position: 'absolute', left: 300, right: 300, top: 380, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 48 }}>
        {SCREEN.map((c, i) => {
          const p = prog(T, t0 + 1.2 + i * 1.4, t0 + 1.9 + i * 1.4);
          return (
            <div key={i} style={{ boxSizing: 'border-box', padding: '36px 40px', borderTop: `1px solid ${th.accent}`, background: th.card,
              opacity: MOTION.enter(p), transform: `translateY(${24 * (1 - MOTION.enter(p))}px)`, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontFamily: BODY, fontSize: 22, letterSpacing: '0.16em', color: th.accent, fontFeatureSettings: TNUM }}>{c.year}</div>
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 52, lineHeight: 1.05, color: th.ink }}>{c.title}</div>
              <div style={{ fontFamily: BODY, fontSize: 25, lineHeight: 1.5, color: th.muted }}>{c.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Close ----------------
function Close({ T, C, th }) {
  const t0 = C.Close;
  if (T < t0 - 0.3) return null;
  const h = prog(T, t0 - 0.2, t0 + 0.8), h2 = prog(T, t0 + 1.0, t0 + 1.9);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: (h) > 0 ? 1 : 0, transform: `translateY(${16 * (1 - MOTION.enter(h))}px)`,
        fontFamily: SERIF, fontSize: 72, lineHeight: 1, color: th.ink }}><Words p={h}>{"A rule for right triangles, recorded for nearly 4,000 years."}</Words></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: (h2) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 52, lineHeight: 1.1, color: th.accent }}><Words p={h2}>{"Pythagorean Theorem Day · October 24, 2026"}</Words></div>
    </div>
  );
}

function CuriositiesPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 84;
  const fade = 1 - prog(T, end - 0.7, end - 0.05);
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.accent} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Opening T={T} C={CUES} th={th} />
        <School T={T} C={CUES} th={th} />
        <Music T={T} C={CUES} th={th} />
        <Root2 T={T} C={CUES} th={th} />
        <Numbers T={T} C={CUES} th={th} />
        <Screen T={T} C={CUES} th={th} />
        <Close T={T} C={CUES} th={th} />
        {/* School */}<ShapeMorph T={T} at={CUES.School} k={0} cx={560} cy={560} color={th.accent} />
        {/* Music */}<ShapeMorph T={T} at={CUES.Music} k={1} cx={560} cy={560} color={th.accent} />
        {/* Root2 */}<ShapeMorph T={T} at={CUES.Root2} k={2} cx={560} cy={560} color={th.accent} />
        {/* Numbers */}<ShapeMorph T={T} at={CUES.Numbers} k={3} cx={960} cy={600} color={th.accent} />
        {/* Screen */}<ShapeMorph T={T} at={CUES.Screen} k={4} cx={960} cy={600} color={th.accent} />
      </div>
    </div>
  );
}

function CuriositiesApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum' });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <CuriositiesPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

return CuriositiesPiece;
})(makeUse("VII ", "Open", 84)) });

const ALL_IMAGES = ["images/plimpton-322.jpg", "images/pythagoras-bust.jpg", "images/euclid-oxyrhynchus.jpg", "images/zhoubi-gougu.jpg", "images/garfield.jpg", "images/einstein-child.jpg", "images/rl-square.jpg", "images/rl-diamond.jpg", "images/rl-tv.jpg", "images/rl-ladder.jpg"];
// between parts: the morphing outline from the scene handoffs, larger and centred, bridging one part into the next
const PART_N = 72;
const PART_SHAPES = [
  [[-0.5, 0.33], [0.5, 0.33], [-0.5, -0.42]],
  [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  null,
].map((V) => {
  if (!V) return Array.from({ length: PART_N }, (_, i) => { const a = -Math.PI * 0.75 + (2 * Math.PI * i) / PART_N; return [0.5 * Math.cos(a), 0.5 * Math.sin(a)]; });
  const E = V.map((v, i) => [v, V[(i + 1) % V.length]]), len = E.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), total = len.reduce((x, y) => x + y, 0);
  return Array.from({ length: PART_N }, (_, i) => {
    let d = (i / PART_N) * total, j = 0;
    while (d > len[j]) { d -= len[j]; j++; }
    const [a, b] = E[j], t = d / len[j];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
});
function PartMorph({ T, at, k, cx, cy, size = 360, color }) {
  const q = Math.max(0, Math.min(1, (T - (at - 0.9)) / 1.8));
  if (q <= 0 || q >= 1) return null;
  const e = Easing.easeInOutCubic(q), A = PART_SHAPES[k % 3], B = PART_SHAPES[(k + 1) % 3];
  const s = size * (0.55 + 0.45 * Math.sin(Math.PI * q));
  const pts = A.map((p, i) => `${((p[0] + (B[i][0] - p[0]) * e) * s).toFixed(1)},${((p[1] + (B[i][1] - p[1]) * e) * s).toFixed(1)}`).join(' ');
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: Math.sin(Math.PI * q) }} aria-hidden="true">
      <g transform={`translate(${cx} ${cy}) rotate(${180 * e - 90})`}>
        <polygon points={pts} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" transform="scale(1.2)" />
      </g>
    </svg>
  );
}
function AllPiece({ tweaks }) {
  const { T, CUES } = useComposition();
  const active = PIECES.findIndex((p, i) => {
    const s = CUES[p.prefix + p.first], e = i + 1 < PIECES.length ? CUES[PIECES[i + 1].prefix + PIECES[i + 1].first] : Infinity;
    return T >= s && T < e;
  });
  const idx = active < 0 ? PIECES.length - 1 : active;
  const P = PIECES[idx].Piece;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 }}>
        {ALL_IMAGES.map((f) => <img key={f} src={f} />)}
      </div>
      <P key={idx} tweaks={tweaks} />
      {PIECES.slice(1).map((p, k) => <PartMorph key={p.prefix} T={T} at={CUES[p.prefix + p.first]} k={k} cx={960} cy={540} size={560} color={tweaks.ground === 'Paper' ? '#7d5411' : '#f5d4f2'} />)}
    </div>
  );
}
function AllPostersApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum', palette: 'Series', showSeconds: true, showCounter: true });
  return (
    <React.Fragment>
      <CompositionStage width={1920} height={1080} bg={t.ground === 'Paper' ? '#f3f2f2' : '#202b48'} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <AllPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground (II–VII)" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
        <TweakRadio label="Square colors (I)" value={t.palette} options={['Series', 'Mono']} onChange={(v) => setTweak('palette', v)} />
        <TweakToggle label="Countdown seconds" value={t.showSeconds} onChange={(v) => setTweak('showSeconds', v)} />
        <TweakToggle label="Proof counter" value={t.showCounter} onChange={(v) => setTweak('showCounter', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.AllPostersApp = AllPostersApp;
