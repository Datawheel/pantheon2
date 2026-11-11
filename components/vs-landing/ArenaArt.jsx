// Finite CSS animations and vector artwork: crisp at every size, no GIF payload.
export default function ArenaArt() {
  return <div className="arena-art" aria-hidden="true">
    <svg viewBox="0 0 480 320" fill="none">
      <g className="arena-track" stroke="currentColor" opacity=".16">
        {[0, 1, 2, 3].map(i => <rect key={i} x={20 + i * 16} y={50 + i * 16} width={440 - i * 32} height={220 - i * 32} rx={110 - i * 16}/>)}
        <path d="M240 50V270M20 160H460" strokeDasharray="4 7"/>
      </g>
      <g className="arena-pennant arena-pennant-a">
        <path d="M80 54L220 76V249L150 216L80 249Z" fill="#a3482f"/>
        <path d="M91 69L209 87V231L150 203L91 231Z" stroke="#f4e9d6" opacity=".5"/>
        <path d="M119 165L150 106L181 165M131 145H169" stroke="#f4e9d6" strokeWidth="7"/>
        <path d="M114 186H186" stroke="#f4e9d6" strokeWidth="2"/>
      </g>
      <g className="arena-pennant arena-pennant-b">
        <path d="M260 76L400 54V249L330 216L260 249Z" fill="#2f6690"/>
        <path d="M271 87L389 69V231L330 203L271 231Z" stroke="#f4e9d6" opacity=".5"/>
        <path d="M310 108V165H337C365 165 365 137 337 137H310M337 137C360 137 360 108 337 108H310" stroke="#f4e9d6" strokeWidth="7"/>
        <path d="M294 186H366" stroke="#f4e9d6" strokeWidth="2"/>
      </g>
      <g className="arena-seal">
        <circle cx="240" cy="165" r="45" fill="#f4e9d6" stroke="#b28a45" strokeWidth="2"/>
        <circle cx="240" cy="165" r="37" stroke="#b28a45"/>
        <text x="240" y="174" textAnchor="middle" fill="#352d25" fontSize="27" fontFamily="Georgia, serif">VS</text>
      </g>
      <g stroke="#b28a45" strokeWidth="2"><path d="M228 28L240 15L252 28M240 15V39M228 292L240 305L252 292M240 281V305"/></g>
    </svg>
  </div>;
}
