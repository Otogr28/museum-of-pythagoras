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
window.CSApp = CSApp;
