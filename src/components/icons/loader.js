import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      {/* Hexagon outline */}
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M 50, 5
           L 11, 27
           L 11, 72
           L 50, 95
           L 89, 73
           L 89, 28 z"
      />
      {/* H Letter Path */}
      <path
        d="M40 35 L40 65 M40 50 L60 50 M60 35 L60 65"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <animate
          attributeName="stroke-dasharray"
          from="0,200"
          to="200,200"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
);

export default IconLoader;
