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
window.ProofsApp = ProofsApp;
