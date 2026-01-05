export const Logo = () => (
  <svg
    width="240"
    height="70"
    viewBox="0 0 320 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Main gradient */}
      <linearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="60%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>

      {/* Inner glow */}
      <radialGradient id="innerGlow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
      </radialGradient>

      {/* Soft shadow */}
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="3"
          floodColor="#000"
          floodOpacity="0.15"
        />
      </filter>
    </defs>

    {/* Icon */}
    <g transform="translate(10,10)" filter="url(#softShadow)">
      {/* Circular flow */}
      <path
        d="M40 6
           C61 6 78 23 78 44
           C78 55 74 65 67 72
           L75 82
           L48 77
           L55 52
           L62 59
           C66 55 69 49 69 43
           C69 29 58 18 44 18
           C30 18 19 29 19 43
           C19 52 23 60 29 65
           L20 73
           C12 66 8 55 8 43
           C8 22 23 6 40 6Z"
        fill="url(#ecoGradient)"
      />

      {/* Inner glow */}
      <circle cx="44" cy="44" r="26" fill="url(#innerGlow)" />

      {/* Growth bars */}
      <rect x="33" y="36" width="7" height="28" rx="3" fill="#16A34A" />
      <rect x="44" y="26" width="7" height="38" rx="3" fill="#CA8A04" />

      {/* Dollar symbol */}
      <path
        d="M47 24V64
           M52 28H44
           C41 28 39 30 39 33
           C39 36 41 38 44 38H50
           C53 38 55 40 55 43
           C55 46 53 48 50 48H39"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Leaf */}
      <path
        d="M26 50
           C18 54 15 61 16 68
           C18 78 30 80 38 70
           C43 64 42 54 42 54
           C36 51 31 49 26 50Z"
        fill="#15803D"
      />
    </g>

    {/* Brand text */}
    <text
      x="95"
      y="54"
      fill="#1F2937"
      style={{
        font: "700 32px 'Inter', sans-serif",
        letterSpacing: "-1px"
      }}
    >
      Waste<tspan fill="#16A34A">2</tspan>Wealth
    </text>

    {/* Tagline */}
    <text
      x="97"
      y="78"
      fill="#6B7280"
      style={{
        font: "500 13px 'Inter', sans-serif",
        letterSpacing: "2px"
      }}
    >
      RECYCLE • EARN • SUSTAIN
    </text>
  </svg>
);
