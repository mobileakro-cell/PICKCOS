// Generated brand illustration for the home hero — a K-beauty supply scene:
// production factory (right) connected to an exhibition hall (centre) by the
// PICKCOS "matching" arc. Flat vector in the brand green palette so it reads as
// a designed banner rather than a stock photo, and gives the left side texture.
export default function HeroGraphic({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hg-glow" cx="78%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#115C45" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0A3325" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hg-tank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0E4A38" />
          <stop offset="55%" stopColor="#14664C" />
          <stop offset="100%" stopColor="#0C4433" />
        </linearGradient>
        <pattern id="hg-dots" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#5DCAA5" opacity="0.10" />
        </pattern>
      </defs>

      {/* texture + glow */}
      <rect width="1440" height="640" fill="url(#hg-dots)" />
      <ellipse cx="1120" cy="270" rx="560" ry="440" fill="url(#hg-glow)" />

      {/* ground */}
      <rect x="0" y="486" width="1440" height="154" fill="#08281D" opacity="0.55" />
      <line x1="0" y1="486" x2="1440" y2="486" stroke="#1D9E75" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* faint left-side booth silhouettes — texture behind the headline */}
      <g opacity="0.13" fill="#5DCAA5">
        <rect x="80" y="392" width="118" height="94" rx="4" />
        <path d="M80 392 Q139 356 198 392 Z" />
        <rect x="250" y="300" width="8" height="186" />
        <rect x="238" y="300" width="44" height="26" rx="3" />
      </g>

      {/* ===== EXHIBITION HALL (centre) ===== */}
      <g>
        {/* entrance arch banner */}
        <rect x="556" y="300" width="10" height="186" fill="#0E4A38" />
        <rect x="912" y="300" width="10" height="186" fill="#0E4A38" />
        <path d="M561 300 Q741 250 917 300" fill="none" stroke="#1D9E75" strokeWidth="6" strokeOpacity="0.85" />
        <rect x="641" y="266" width="196" height="30" rx="6" fill="#0C4433" stroke="#5DCAA5" strokeOpacity="0.5" />
        <rect x="663" y="277" width="152" height="8" rx="4" fill="#5DCAA5" opacity="0.55" />

        {/* booth canopies */}
        {[600, 726, 852].map((x) => (
          <g key={x}>
            <path d={`M${x} 402 Q${x + 48} 366 ${x + 96} 402 Z`} fill="#14664C" />
            <path d={`M${x} 402 Q${x + 48} 366 ${x + 96} 402`} fill="none" stroke="#1D9E75" strokeWidth="3" />
            <rect x={x + 4} y="402" width="88" height="84" fill="#0E4A38" />
            <rect x={x + 4} y="402" width="88" height="84" fill="none" stroke="#0A3325" strokeWidth="1" />
            {/* little display panels + product dots */}
            <rect x={x + 16} y="430" width="26" height="56" rx="2" fill="#115C45" />
            <rect x={x + 54} y="430" width="26" height="56" rx="2" fill="#115C45" />
            <circle cx={x + 29} cy="446" r="4" fill="#A9E3CE" opacity="0.8" />
            <circle cx={x + 67} cy="446" r="4" fill="#A9E3CE" opacity="0.8" />
          </g>
        ))}

        {/* banner flags */}
        <g>
          <rect x="690" y="214" width="6" height="60" fill="#0E4A38" />
          <path d="M696 216 L730 224 L696 236 Z" fill="#1D9E75" />
          <rect x="806" y="222" width="6" height="52" fill="#0E4A38" />
          <path d="M812 224 L842 231 L812 242 Z" fill="#E9C46A" opacity="0.85" />
        </g>

        {/* tiny visitors */}
        {[[636, 470], [672, 476], [764, 470], [808, 478], [880, 472]].map(([cx, cy], i) => (
          <g key={i} fill="#A9E3CE" opacity="0.85">
            <circle cx={cx} cy={cy - 14} r="4.5" />
            <rect x={cx - 4.5} y={cy - 8} width="9" height="16" rx="4" />
          </g>
        ))}
      </g>

      {/* ===== PRODUCTION FACTORY (right) ===== */}
      <g>
        {/* chimney + steam */}
        <rect x="1104" y="250" width="26" height="236" fill="#0C4433" />
        <rect x="1104" y="250" width="26" height="10" fill="#1D9E75" opacity="0.7" />
        <g fill="#A9E3CE" opacity="0.28">
          <circle cx="1117" cy="232" r="12" />
          <circle cx="1132" cy="214" r="9" />
          <circle cx="1104" cy="210" r="7" />
        </g>

        {/* main building with sawtooth roof */}
        <rect x="1150" y="336" width="248" height="150" fill="#0E4A38" />
        <path d="M1150 336 l24 -30 l24 30 l24 -30 l24 30 l24 -30 l24 30 l24 -30 l24 30 l24 -30 l24 30 Z" fill="#115C45" />
        {/* windows */}
        <g fill="#5DCAA5" opacity="0.6">
          {[1168, 1206, 1244, 1282, 1320, 1358].map((x) =>
            [372, 408, 444].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="18" height="20" rx="2" />)
          )}
        </g>

        {/* storage tanks */}
        {[1006, 1066].map((x) => (
          <g key={x}>
            <rect x={x} y="392" width="48" height="94" rx="6" fill="url(#hg-tank)" />
            <ellipse cx={x + 24} cy="392" rx="24" ry="9" fill="#14664C" />
            <ellipse cx={x + 24} cy="392" rx="24" ry="9" fill="none" stroke="#1D9E75" strokeOpacity="0.7" strokeWidth="1.5" />
            <line x1={x + 6} y1="420" x2={x + 42} y2="420" stroke="#0A3325" strokeWidth="2" />
          </g>
        ))}
        {/* pipe linking tanks to building */}
        <path d="M1090 430 H1150" fill="none" stroke="#0C4433" strokeWidth="7" />

        {/* delivery truck */}
        <g>
          <rect x="1224" y="446" width="70" height="40" rx="3" fill="#0C4433" />
          <rect x="1294" y="458" width="30" height="28" rx="3" fill="#115C45" />
          <rect x="1300" y="462" width="18" height="12" rx="2" fill="#5DCAA5" opacity="0.7" />
          <circle cx="1246" cy="490" r="9" fill="#08281D" stroke="#1D9E75" strokeWidth="2" />
          <circle cx="1306" cy="490" r="9" fill="#08281D" stroke="#1D9E75" strokeWidth="2" />
        </g>
      </g>

      {/* ===== MATCHING ARC (factory ↔ exhibition) ===== */}
      <path d="M636 452 Q880 300 1120 430" fill="none" stroke="#5DCAA5" strokeWidth="2.5" strokeDasharray="1 12" strokeLinecap="round" opacity="0.85" />
      <circle cx="636" cy="452" r="7" fill="#1D9E75" />
      <circle cx="636" cy="452" r="12" fill="none" stroke="#1D9E75" strokeOpacity="0.4" strokeWidth="2" />
      <circle cx="1120" cy="430" r="7" fill="#1D9E75" />
      <circle cx="1120" cy="430" r="12" fill="none" stroke="#1D9E75" strokeOpacity="0.4" strokeWidth="2" />

      {/* sparkle accents */}
      <g fill="#E9C46A" opacity="0.7">
        <circle cx="980" cy="150" r="2.5" />
        <circle cx="1240" cy="196" r="2" />
        <circle cx="720" cy="176" r="2" />
      </g>
    </svg>
  )
}
