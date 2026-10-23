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
window.CuriositiesApp = CuriositiesApp;
