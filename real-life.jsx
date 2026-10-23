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
window.RealLifeApp = RealLifeApp;
