import React from 'react'


const DiamondIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 9l10 13L22 9 12 2z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
            <DiamondIcon />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#1a2340]">Inves</span>
              <span className="text-[#C9A84C]">Try</span>
            </span>
          </div>
  )
}