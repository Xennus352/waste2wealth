export const Logo = () => (
  <svg
    width="180"
    height="48"
    viewBox="0 0 320 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Recycle Symbol */}
    <g transform="translate(10, 10)">
      <path
        d="M28 5L21 17H30L33 23H18L12 12L20 0L28 5Z"
        fill="currentColor"
      />
      <path
        d="M6 20L12 32L4 35L6 41L18 37L15 25L6 20Z"
        fill="currentColor"
      />
      <path
        d="M33 33L27 21L35 18L33 12L21 16L24 28L33 33Z"
        fill="currentColor"
      />
    </g>

    {/* Leaf Icon */}
    <path
      d="M95 20C75 15 60 30 60 45C60 63 78 70 95 58C110 47 112 28 95 20Z"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />

    {/* Text */}
    <text
      x="130"
      y="45"
      fontFamily="Inter, sans-serif"
      fontSize="28"
      fontWeight="700"
      fill="currentColor"
    >
      Waste2Wealth
    </text>

    <text
      x="130"
      y="65"
      fontFamily="Inter, sans-serif"
      fontSize="16"
      fill="currentColor"
    >
      Recycle • Earn • Sustain
    </text>
  </svg>
);
