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
window.HistoryApp = HistoryApp;
