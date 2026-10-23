// Advanced mathematics: arc length, least squares, Parseval's identity. ~61s, 1920x1080, animations-v3.
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
  const t0 = C[name], t1 = typeof next === 'number' ? next : C[next]; // a number: the last scene ends with the piece
  const inP = prog(T, t0 - 0.2, t0 + 0.6), out = prog(T, t1 - 0.6, t1 - 0.05);
  const turn = 16 * (1 - MOTION.enter(inP)) - 16 * MOTION.draw(out), depth = -160 * (1 - MOTION.enter(inP)) - 160 * MOTION.draw(out);
  return { t0, t1, show: inP > 0 && out < 1, o: MOTION.enter(inP) * (1 - out), tf: `perspective(1600px) rotateY(${turn}deg) translateZ(${depth}px) scale(${0.78 + 0.22 * MOTION.enter(inP) - 0.22 * MOTION.draw(out)})` };
}
const tag = (th, txt, x, y, o, color, size = 30, italic = true) => o > 0 && (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o, fontFamily: SERIF, fontStyle: italic ? 'italic' : 'normal',
    fontSize: size, lineHeight: 1, color: color || th.ink, whiteSpace: 'nowrap', fontFeatureSettings: TNUM }}>{txt}</div>
);
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);

// ---------------- Open ----------------
function Opening({ T, C, th }) {
  const out = prog(T, C.Arc - 0.7, C.Arc - 0.05);
  if (out >= 1) return null;
  const a = prog(T, 0.3, 1.3), b = prog(T, 1.0, 1.8);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: (a) > 0 ? 1 : 0, transform: `translateY(${20 * (1 - MOTION.enter(a))}px)`,
        fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: th.ink }}><Words p={a}>{"Advanced mathematics"}</Words></div>
      <div style={{ position: 'absolute', left: 340, right: 340, top: 540, textAlign: 'center', opacity: (b) > 0 ? 1 : 0,
        fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, lineHeight: 1.3, color: th.accent, textWrap: 'balance' }}><Words p={b}>{"Calculus, statistics and analysis"}</Words></div>
    </div>
  );
}

// ---------------- Arc length: chords of a quarter circle (r = 1) ----------------
// n chords sum to 2n·sin(π/4n), which tends to the arc length π/2
const ARC_N = [2, 4, 8, 16, 64];
const chordSum = (n) => 2 * n * Math.sin(Math.PI / (4 * n));
function Arc({ T, C, th }) {
  const s = useScene(T, C, 'Arc', 'Fit');
  if (!s.show) return null;
  const t0 = s.t0, OX = 250, OY = 820, R = 520;
  const X = (a) => OX + R * Math.cos(a), Y = (a) => OY - R * Math.sin(a);
  const ax = prog(T, t0 + 0.4, t0 + 1.0), arcP = MOTION.draw(prog(T, t0 + 0.6, t0 + 1.8));
  // the first two chords hold while the formula is written, then the steps double
  const STEP = 1.4, z = t0 + 2.2, z2 = t0 + 5.2;
  const f = Math.max(0, Math.min(ARC_N.length - 1, (T - z2) / STEP));
  const i = Math.floor(f), q = MOTION.draw(cl((f - i) / 0.4));
  const o = prog(T, z, z + 0.6);
  const stage = (n, op) => {
    if (op <= 0) return null;
    const step = Math.PI / (2 * n);
    return (
      <g key={n} opacity={op}>
        {Array.from({ length: n }, (_, k) => {
          const a0 = k * step, a1 = (k + 1) * step;
          return (
            <g key={k}>
              {n <= 16 && <polygon points={`${X(a0)},${Y(a0)} ${X(a1)},${Y(a0)} ${X(a1)},${Y(a1)}`} fill={th.accent} fillOpacity={k % 2 ? 0.1 : 0.2} stroke="none" />}
              {n <= 8 && <polyline points={`${X(a0)},${Y(a0)} ${X(a1)},${Y(a0)} ${X(a1)},${Y(a1)}`} fill="none" stroke={th.ink} strokeWidth="1.5" opacity="0.6" />}
              <line x1={X(a0)} y1={Y(a0)} x2={X(a1)} y2={Y(a1)} stroke={th.accent} strokeWidth="3" strokeLinecap="round" />
              <circle cx={X(a1)} cy={Y(a1)} r={n <= 16 ? 4 : 2.5} fill={th.accent} />
            </g>
          );
        })}
      </g>
    );
  };
  const n = ARC_N[q > 0.5 ? Math.min(i + 1, ARC_N.length - 1) : i];
  const lab = o * (1 - (i === 0 ? q : 1));
  const m = [(X(0) + X(Math.PI / 4)) / 2, (Y(0) + Y(Math.PI / 4)) / 2];
  const lim = prog(T, z2 + STEP * 4 + 0.6, z2 + STEP * 4 + 1.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g opacity={ax}>
          <line x1={OX} y1={OY} x2={X(0)} y2={OY} stroke={th.hair} strokeWidth="2" />
          <line x1={OX} y1={OY} x2={OX} y2={Y(Math.PI / 2)} stroke={th.hair} strokeWidth="2" />
        </g>
        <polyline points={range(0, (Math.PI / 2) * arcP, 90).map((a) => `${X(a)},${Y(a)}`).join(' ')} fill="none" stroke={th.ink} strokeWidth="2.5" opacity={0.75} />
        {stage(ARC_N[i], o * (i < ARC_N.length - 1 ? 1 - q : 1))}
        {i < ARC_N.length - 1 && stage(ARC_N[i + 1], o * q)}
      </svg>
      {tag(th, 'r = 1', (OX + X(0)) / 2, OY + 34, ax, th.muted, 28)}
      {tag(th, 'dx', (X(0) + X(Math.PI / 4)) / 2, OY - 30, lab, th.ink, 34)}
      {tag(th, 'dy', X(Math.PI / 4) - 40, (OY + Y(Math.PI / 4)) / 2, lab, th.ink, 34)}
      {tag(th, 'ds', m[0] + 64, m[1] - 18, lab, th.accent, 38)}
      <div style={{ position: 'absolute', left: 640, top: 250, opacity: o, fontFeatureSettings: TNUM }}>
        <div style={{ fontFamily: BODY, fontSize: 24, color: th.muted }}>{n} steps</div>
        <div style={{ fontFamily: SERIF, fontSize: 44, color: th.ink, whiteSpace: 'nowrap' }}>∑ ds = {chordSum(n).toFixed(4)}</div>
        <div style={{ fontFamily: SERIF, fontSize: 44, color: th.accent, whiteSpace: 'nowrap', opacity: lim }}>π/2 = 1.5708</div>
      </div>
      <Column T={T} t0={t0} th={th} kicker="Calculus" title="Arc length"
        note="Over a short step a curve is nearly straight, so each step is the hypotenuse of a small right triangle.">
        <FLine T={T} at={t0 + 3.0} th={th}>ds² = dx² + dy²</FLine>
        <FLine T={T} at={t0 + 4.0} th={th} color={th.accent}>L = ∫ √(dx² + dy²)</FLine>
      </Column>
    </div>
  );
}

// ---------------- Least squares: four points, the best line through the origin ----------------
// β = Σxy / Σx² = 33 / 30 = 1.1; e = b − p = (−0.1, 0.8, −1.3, 0.6) is perpendicular to p, so 39 = 36.3 + 2.7
const PTS = [[1, 1], [2, 3], [3, 2], [4, 5]], BETA = 1.1;
function Fit({ T, C, th }) {
  const s = useScene(T, C, 'Fit', 'Series');
  if (!s.show) return null;
  const t0 = s.t0;
  const PX = (x) => 220 + x * 150, PY = (y) => 640 - y * 64;
  const ax = prog(T, t0 + 0.5, t0 + 1.1);
  const ln = MOTION.draw(prog(T, t0 + 2.2, t0 + 3.2));
  const U = 80, A = [260, 905], B = [260 + U * Math.sqrt(36.3), 905], Ct = [B[0], 905 - U * Math.sqrt(2.7)];
  const pP = MOTION.draw(prog(T, t0 + 5.0, t0 + 5.8)), eP = MOTION.draw(prog(T, t0 + 5.6, t0 + 6.3)), bP = MOTION.draw(prog(T, t0 + 6.2, t0 + 7.0));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <div style={{ position: 'absolute', left: 160, top: 236, fontFamily: BODY, fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: th.muted, opacity: prog(T, t0 + 0.6, t0 + 1.2) }}>Four points and the best line through the origin</div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g opacity={ax}>
          <line x1={PX(0)} y1={PY(0)} x2={PX(4.6)} y2={PY(0)} stroke={th.hair} strokeWidth="2" />
          <line x1={PX(0)} y1={PY(0)} x2={PX(0)} y2={PY(5.6)} stroke={th.hair} strokeWidth="2" />
          {[1, 2, 3, 4].map((x) => <line key={x} x1={PX(x)} y1={PY(0)} x2={PX(x)} y2={PY(0) + 10} stroke={th.hair} strokeWidth="2" />)}
        </g>
        <line x1={PX(0)} y1={PY(0)} x2={PX(4.6 * ln)} y2={PY(4.6 * BETA * ln)} stroke={th.accent} strokeWidth="3.5" strokeLinecap="round" />
        {PTS.map(([x, y], j) => {
          const e = MOTION.draw(prog(T, t0 + 3.4 + j * 0.3, t0 + 3.9 + j * 0.3));
          return <line key={j} x1={PX(x)} y1={PY(y)} x2={PX(x)} y2={PY(lerp(y, BETA * x, e))} stroke={th.ink} strokeWidth="2.5" strokeDasharray="7 6" />;
        })}
        {PTS.map(([x, y], j) => <circle key={'p' + j} cx={PX(x)} cy={PY(y)} r={9 * MOTION.pop(prog(T, t0 + 1.0 + j * 0.2, t0 + 1.5 + j * 0.2))} fill={th.ink} />)}
        <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${Ct[0]},${Ct[1]}`} fill={th.accent} fillOpacity={0.16 * bP} stroke="none" />
        <line x1={A[0]} y1={A[1]} x2={lerp(A[0], B[0], pP)} y2={A[1]} stroke={th.accent} strokeWidth="3.5" opacity={pP > 0 ? 1 : 0} />
        <line x1={B[0]} y1={B[1]} x2={B[0]} y2={lerp(B[1], Ct[1], eP)} stroke={th.ink} strokeWidth="3" strokeDasharray="7 6" opacity={eP > 0 ? 1 : 0} />
        <line x1={A[0]} y1={A[1]} x2={lerp(A[0], Ct[0], bP)} y2={lerp(A[1], Ct[1], bP)} stroke={th.ink} strokeWidth="4" opacity={bP > 0 ? 1 : 0} />
        <polyline points={`${B[0] - 20},${B[1]} ${B[0] - 20},${B[1] - 20} ${B[0]},${B[1] - 20}`} fill="none" stroke={th.ink} strokeWidth="1.5" opacity={eP} />
      </svg>
      {[1, 2, 3, 4].map((x) => <React.Fragment key={x}>{tag(th, String(x), PX(x), PY(0) + 32, ax, th.muted, 24, false)}</React.Fragment>)}
      {tag(th, 'b, the data', PX(2) - 18, PY(3) - 34, prog(T, t0 + 1.6, t0 + 2.2), th.muted, 26)}
      {tag(th, 'p, the fit', PX(4.3) + 70, PY(4.3 * BETA) + 10, prog(T, t0 + 3.0, t0 + 3.6), th.accent, 26)}
      {tag(th, 'e, the error', PX(3) + 92, PY(2.65), prog(T, t0 + 4.4, t0 + 5.0), th.ink, 26)}
      {tag(th, '|p|² = 36.3', (A[0] + B[0]) / 2, A[1] + 34, pP, th.accent, 32, false)}
      {tag(th, '|e|² = 2.7', B[0] + 92, (B[1] + Ct[1]) / 2, eP, th.ink, 32, false)}
      {tag(th, '|b|² = 39', (A[0] + Ct[0]) / 2 - 40, (A[1] + Ct[1]) / 2 - 36, bP, th.ink, 32, false)}
      <Column T={T} t0={t0} th={th} kicker="Statistics · Legendre, 1805" title="Least squares"
        note="The best-fitting line leaves an error perpendicular to the fit, so the squares add.">
        <FLine T={T} at={t0 + 7.2} th={th}>|b|² = |p|² + |e|²</FLine>
        <FLine T={T} at={t0 + 8.2} th={th} color={th.accent}>39 = 36.3 + 2.7</FLine>
      </Column>
    </div>
  );
}

// ---------------- Parseval: f(x) = x on (−π, π) ----------------
// x = ∑ 2(−1)ⁿ⁺¹ sin(nx)/n; (1/π)∫x² dx = 2π²/3 = ∑ (2/n)², so ∑ 1/n² = π²/6
const TOTAL2 = (2 * Math.PI * Math.PI) / 3;
const term = (x, n) => (2 * (n % 2 ? 1 : -1) * Math.sin(n * x)) / n;
const partial = (x, N) => { let v = 0; const k = Math.floor(N); for (let n = 1; n <= k; n++) v += term(x, n); return v + (N - k) * term(x, k + 1); };
const sq = (N) => { let v = 0; const k = Math.floor(N); for (let n = 1; n <= k; n++) v += 4 / (n * n); return v + (N - k) * 4 / ((k + 1) * (k + 1)); };
function Series({ T, C, th, end }) {
  const s = useScene(T, C, 'Series', end + 1);
  if (!s.show) return null;
  const t0 = s.t0, z = t0 + 2.0;
  const GX = (x) => 560 + x * 110, GY = (y) => 450 - y * 58;
  const ax = prog(T, t0 + 0.4, t0 + 1.0), fl = MOTION.draw(prog(T, t0 + 0.8, t0 + 1.6));
  const N = T < z ? 0 : T < z + 6.4 ? 1 + (T - z) / 0.8 : lerp(9, 40, MOTION.draw(prog(T, z + 6.4, z + 8.6)));
  const BX = 214, BY = 760, BH = 46, BU = 692 / TOTAL2;
  const segs = [];
  let acc = 0;
  for (let n = 1; n <= Math.ceil(N); n++) {
    const w = (4 / (n * n)) * BU * Math.min(1, N - n + 1);
    segs.push(<rect key={n} x={BX + acc} y={BY} width={Math.max(0, w)} height={BH} fill={th.accent} fillOpacity={n % 2 ? 0.55 : 0.3} stroke={th.bg} strokeWidth={n < 12 ? 1.5 : 0.5} />);
    acc += w;
  }
  const bo = prog(T, z - 0.4, z + 0.2);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s.o, transform: s.tf }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g opacity={ax}>
          <line x1={GX(-Math.PI)} y1={GY(0)} x2={GX(Math.PI)} y2={GY(0)} stroke={th.hair} strokeWidth="2" />
          <line x1={GX(0)} y1={GY(-Math.PI)} x2={GX(0)} y2={GY(Math.PI)} stroke={th.hair} strokeWidth="2" />
        </g>
        <line x1={GX(-Math.PI)} y1={GY(-Math.PI)} x2={GX(lerp(-Math.PI, Math.PI, fl))} y2={GY(lerp(-Math.PI, Math.PI, fl))} stroke={th.ink} strokeWidth="2" opacity="0.55" />
        {N > 0 && <polyline points={range(-Math.PI, Math.PI, 300).map((x) => `${GX(x).toFixed(1)},${GY(partial(x, N)).toFixed(1)}`).join(' ')} fill="none" stroke={th.accent} strokeWidth="3" strokeLinejoin="round" />}
        <g opacity={bo}>
          <rect x={BX} y={BY} width={692} height={BH} fill="none" stroke={th.ink} strokeWidth="1.5" strokeDasharray="6 6" opacity="0.7" />
          {segs}
        </g>
      </svg>
      {tag(th, 'f(x) = x', GX(-1.7), GY(2.3), prog(T, t0 + 1.4, t0 + 2.0), th.ink, 32)}
      {tag(th, '−π', GX(-Math.PI), GY(0) + 30, ax, th.muted, 26, false)}
      {tag(th, 'π', GX(Math.PI), GY(0) + 30, ax, th.muted, 26, false)}
      <div style={{ position: 'absolute', left: BX, top: BY - 48, width: 692, display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontSize: 24, color: th.muted, opacity: bo, fontFeatureSettings: TNUM }}>
        <span>{N > 0 ? `${Math.max(1, Math.round(N))} sine ${Math.round(N) === 1 ? 'wave' : 'waves'}` : ''}</span>
        <span>2π²/3 = {TOTAL2.toFixed(4)}</span>
      </div>
      <div style={{ position: 'absolute', left: BX, top: BY + BH + 14, width: 692, textAlign: 'right', fontFamily: SERIF, fontSize: 40, color: th.ink, opacity: bo, fontFeatureSettings: TNUM, whiteSpace: 'nowrap' }}>
        ∑ (2/n)² = {sq(N).toFixed(4)}</div>
      <Column T={T} t0={t0} th={th} kicker="Analysis · Parseval, 1799" title="Parseval’s identity"
        note="Sine waves of different frequencies are perpendicular, so the squared length of a function is the sum of its squared coefficients.">
        <FLine T={T} at={t0 + 4.6} th={th}>2π²/3 = ∑ (2/n)²</FLine>
        <FLine T={T} at={t0 + 10.6} th={th} color={th.accent}>1 + 1/4 + 1/9 + … = π²/6</FLine>
        <div style={{ fontFamily: BODY, fontSize: 26, color: th.muted, opacity: prog(T, t0 + 11.8, t0 + 12.6) }}>Euler found this sum in 1735.</div>
      </Column>
    </div>
  );
}

function AdvancedPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 54.5;
  const fade = 1 - prog(T, end - 0.7, end - 0.05);
  return (
    <div ref={rootRef} className="om3d" style={{ position: 'absolute', inset: 0, background: th.bg, overflow: 'hidden', '--sheen': `${130 - ((time % 7) / 7) * 160}%` }}>
      <style>{DEPTH_CSS}</style>
      <Field time={time} ink={th.muted} accent={th.accent} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade, transform: STAGE(T), transformOrigin: '960px 540px' }}>
        <Opening T={T} C={CUES} th={th} />
        <Arc T={T} C={CUES} th={th} />
        <Fit T={T} C={CUES} th={th} />
        <Series T={T} C={CUES} th={th} end={end} />
        {/* Arc */}<ShapeMorph T={T} at={CUES.Arc} k={0} cx={560} cy={560} color={th.accent} />
        {/* Fit */}<ShapeMorph T={T} at={CUES.Fit} k={1} cx={560} cy={560} color={th.accent} />
        {/* Series */}<ShapeMorph T={T} at={CUES.Series} k={2} cx={560} cy={560} color={th.accent} />
      </div>
    </div>
  );
}

function AdvancedApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, ground: 'Museum' });
  const th = THEMES[t.ground] || THEMES.Museum;
  return (
    <React.Fragment>
      <CompositionStage width={W} height={H} bg={th.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <AdvancedPiece tweaks={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakRadio label="Ground" value={t.ground} options={['Museum', 'Paper']} onChange={(v) => setTweak('ground', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.AdvancedApp = AdvancedApp;
