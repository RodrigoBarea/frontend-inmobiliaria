// components/WaveSVG.tsx
import React from 'react'

interface WaveSVGProps extends React.SVGProps<SVGSVGElement> {}

const WaveSVG: React.FC<WaveSVGProps> = (props) => (
  <svg
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
  >
    <path
      d="M0,0 C600,100 600,0 1200,100 L1200,120 L0,120 Z"
      fill="#ffffff"
    />
  </svg>
)

export default WaveSVG
