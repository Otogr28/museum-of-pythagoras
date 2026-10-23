// Beyond the theorem — triples, irrational lengths, Fermat, the sphere, relativity. ~73s, 1920x1080, animations-v3.
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
function Relativity({ T, C, th, end }) {
  const s = useScene(T, C, 'Relativity', end + 1);
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

function BeyondPiece({ tweaks }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const th = THEMES[tweaks.ground] || THEMES.Museum;
  const rootRef = React.useRef(null);
  const sec = Math.floor(T);
  React.useEffect(() => { rootRef.current && rootRef.current.setAttribute('data-screen-label', `t=${sec}s`); }, [sec]);
  const end = authoredTotal || 73.5;
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
        <Relativity T={T} C={CUES} th={th} end={end} />
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
window.BeyondApp = BeyondApp;
