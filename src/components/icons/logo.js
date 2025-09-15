import React from 'react';

const IconLogo = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
    <title>Logo</title>
    <g transform="translate(-8.000000, -2.000000)">
      <g transform="translate(11.000000, 5.000000)">
        {/* Hexagon filled with darkNavy */}
        <polygon id="Shape" fill="#020c1b" points="39 0 0 22 0 67 39 90 78 68 78 23" />
        {/* Letter H centered */}
        <text
          x="39" // half of width
          y="48" // half of height
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#64ffda"
          fontSize="40"
          fontFamily="Arial, sans-serif"
          fontWeight="bold">
          H
        </text>
      </g>
    </g>
  </svg>
);

export default IconLogo;
