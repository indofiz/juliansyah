import { capabilities } from "@/content/site";

/* Holographic line-art illustrations: mint strokes, glassy fills, glow. */
const stroke = "#7dffd0";
const glass = "rgba(47,227,154,0.12)";

function Circuit({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="rgba(125,255,208,0.35)" strokeWidth="1.2" />;
}

function ArtCube() {
  return (
    <svg viewBox="0 0 320 220" className="bento-art" aria-hidden="true">
      <Circuit d="M20 120 H90 L110 100 M230 100 L250 120 H300 M160 10 V40" />
      <circle cx="160" cy="12" r="3.5" fill="#e9fff6" />
      <g filter="url(#glow-a)">
        <path d="M160 48 L222 82 L222 150 L160 184 L98 150 L98 82 Z" fill={glass} stroke={stroke} strokeWidth="1.6" />
        <path d="M160 48 L160 116 M98 82 L160 116 L222 82" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
        <path d="M160 116 L160 184" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
        <circle cx="160" cy="116" r="22" fill="none" stroke={stroke} strokeDasharray="3 4" opacity="0.8" />
      </g>
      <rect x="128" y="190" width="64" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(125,255,208,0.4)" />
      <defs>
        <filter id="glow-a" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function ArtAI() {
  return (
    <svg viewBox="0 0 320 220" className="bento-art" aria-hidden="true">
      <Circuit d="M230 0 V60 M230 160 V220" />
      <circle cx="230" cy="62" r="4" fill="#9fffd8" />
      <circle cx="230" cy="158" r="4" fill="#9fffd8" />
      <g filter="url(#glow-b)">
        <rect x="150" y="70" width="150" height="90" rx="12" fill={glass} stroke={stroke} strokeWidth="1.6" />
        <rect x="135" y="160" width="180" height="12" rx="4" fill="rgba(47,227,154,0.25)" stroke={stroke} strokeWidth="1.2" />
        <text x="262" y="108" fill="#d8fff0" fontSize="22" fontWeight="700" textAnchor="middle" fontFamily="inherit">
          AI
        </text>
        <rect x="236" y="120" width="44" height="5" rx="2" fill="#9fffd8" />
        <rect x="220" y="131" width="60" height="3" rx="1.5" fill="rgba(159,255,216,0.5)" />
        <circle cx="160" cy="112" r="26" fill="rgba(0,0,0,0.65)" stroke={stroke} strokeWidth="2" />
        <path d="M160 101 V123 M149 112 H171" stroke="#e9fff6" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M141 131 L120 152" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      </g>
      <defs>
        <filter id="glow-b" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function ArtBars() {
  const bars = [34, 48, 40, 78, 44, 36, 30];
  return (
    <svg viewBox="0 0 320 220" className="bento-art" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="62" y={40 + i * 18} width="6" height="2" fill="rgba(125,255,208,0.6)" />
      ))}
      <path d="M65 22 l-5 8 h10 Z M65 52 l-5 -8 h10 Z" fill="rgba(125,255,208,0.7)" />
      <Circuit d="M110 30 H250 M110 175 H250" />
      <g filter="url(#glow-c)">
        <rect x="100" y="60" width="150" height="90" rx="10" fill="rgba(47,227,154,0.06)" stroke="rgba(125,255,208,0.45)" />
        {bars.map((h, i) => (
          <rect key={i} x={112 + i * 19} y={140 - h} width="13" height={h} rx="2.5" fill={glass} stroke={stroke} strokeWidth="1.4" />
        ))}
        <rect x="143" y="158" width="64" height="20" rx="10" fill="rgba(0,0,0,0.6)" stroke={stroke} />
        <text x="175" y="172" fill="#d8fff0" fontSize="10.5" textAnchor="middle" fontFamily="inherit">
          60 fps
        </text>
      </g>
      <defs>
        <filter id="glow-c" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function ArtStats() {
  return (
    <svg viewBox="0 0 320 220" className="bento-art" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x="70" y={50 + i * 22} width="8" height="2" fill="rgba(125,255,208,0.6)" />
          <rect x="244" y={50 + i * 22} width="8" height="2" fill="rgba(125,255,208,0.6)" />
        </g>
      ))}
      <g filter="url(#glow-d)">
        <rect x="95" y="40" width="132" height="140" rx="16" fill="rgba(47,227,154,0.06)" stroke="rgba(125,255,208,0.4)" />
        <rect x="105" y="120" width="112" height="44" rx="8" fill={glass} stroke={stroke} strokeWidth="1.4" />
        <rect x="117" y="98" width="22" height="40" rx="3" fill={glass} stroke={stroke} strokeWidth="1.4" />
        <rect x="147" y="80" width="22" height="58" rx="3" fill={glass} stroke={stroke} strokeWidth="1.4" />
        <rect x="177" y="56" width="22" height="82" rx="3" fill="rgba(125,255,208,0.22)" stroke={stroke} strokeWidth="1.6" />
        <rect x="112" y="60" width="44" height="18" rx="9" fill="rgba(0,0,0,0.6)" stroke={stroke} />
        <text x="134" y="73" fill="#d8fff0" fontSize="10" textAnchor="middle" fontFamily="inherit">
          98
        </text>
      </g>
      <defs>
        <filter id="glow-d" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

const arts = { cube: ArtCube, ai: ArtAI, bars: ArtBars, stats: ArtStats } as const;

/** Bento grid: radial cyan-mint glows, dotted corners, glassy illustrations. */
export function Capabilities() {
  return (
    <section id="capabilities" className="section capabilities">
      <div className="container bento">
        {capabilities.map((c, i) => {
          const Art = arts[c.art as keyof typeof arts];
          return (
            <article key={c.title} className={`bento-card bento-${i + 1}`} data-reveal>
              <span className="bento-glow" />
              <span className="dots bento-dots" />
              <Art />
              <div className="bento-copy">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
