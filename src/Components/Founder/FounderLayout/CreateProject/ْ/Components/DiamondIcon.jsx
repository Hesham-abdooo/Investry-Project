import React from "react";

const DiamondIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="gemGrad"
        x1="10"
        y1="8"
        x2="26"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#F5D060" />
        <stop offset="50%" stopColor="#D4A017" />
        <stop offset="100%" stopColor="#A67C00" />
      </linearGradient>
      <linearGradient
        id="bgGrad"
        x1="0"
        y1="0"
        x2="36"
        y2="36"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#1a2744" />
        <stop offset="100%" stopColor="#0F2044" />
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#bgGrad)" />
    <path d="M18 8L10 15l8 13 8-13-8-7z" fill="url(#gemGrad)" opacity="0.2" />
    <path
      d="M18 8L10 15l8 13 8-13-8-7z"
      stroke="url(#gemGrad)"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M10 15h16"
      stroke="url(#gemGrad)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M14 8l-4 7M22 8l4 7"
      stroke="url(#gemGrad)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 28l-4-13M18 28l4-13"
      stroke="url(#gemGrad)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8h8"
      stroke="url(#gemGrad)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M13 13l5-5 5 5"
      stroke="#F5D060"
      strokeWidth="0.6"
      opacity="0.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DiamondIcon;
