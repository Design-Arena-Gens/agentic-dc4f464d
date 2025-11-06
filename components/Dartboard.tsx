"use client";
import React from 'react';

type Props = { size?: number };

const SEGMENT_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const COLORS = {
  baseDark: '#151515',
  baseLight: '#f2ede4',
  wire: '#c0c6cf',
  ringRed: '#d11f2a',
  ringGreen: '#2e8b57',
  outerRingBg: '#000000',
  number: '#ffffff',
  bullRed: '#d11f2a',
  bullGreen: '#2e8b57',
};

// Board radii (arbitrary but proportionally realistic)
const R = {
  board: 200, // overall playing field to double outer
  doubleOuter: 200,
  doubleInner: 170,
  tripleOuter: 110,
  tripleInner: 90,
  outerBull: 15,
  innerBull: 6,
  numberRingRadius: 225,
  numberBandStroke: 28,
  outerMetalStroke: 6,
};

function annularSectorPath(rInner: number, rOuter: number, startDegFromTop: number, endDegFromTop: number): string {
  const toRad = (d: number) => (d - 90) * Math.PI / 180; // rotate so 0? is at top
  const a0 = toRad(startDegFromTop);
  const a1 = toRad(endDegFromTop);
  const x0o = rOuter * Math.cos(a0), y0o = rOuter * Math.sin(a0);
  const x1o = rOuter * Math.cos(a1), y1o = rOuter * Math.sin(a1);
  const x1i = rInner * Math.cos(a1), y1i = rInner * Math.sin(a1);
  const x0i = rInner * Math.cos(a0), y0i = rInner * Math.sin(a0);
  const largeArc = Math.abs(endDegFromTop - startDegFromTop) > 180 ? 1 : 0;
  return [
    `M ${x0o} ${y0o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x0i} ${y0i}`,
    'Z',
  ].join(' ');
}

export default function Dartboard({ size = 600 }: Props) {
  const view = 2 * (R.numberRingRadius + R.numberBandStroke); // allow space for number band
  const scale = size / view;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-view / 2} ${-view / 2} ${view} ${view}`}
      style={{ display: 'block', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
      aria-label="Dartboard"
      role="img"
    >
      {/* Number ring band */}
      <circle r={R.numberRingRadius} fill="none" stroke={COLORS.outerRingBg} strokeWidth={R.numberBandStroke} />

      {/* Outer metal ring */}
      <circle r={R.doubleOuter} fill="none" stroke={COLORS.wire} strokeWidth={R.outerMetalStroke} />

      {/* Background base to hide number band behind the board */}
      <circle r={R.doubleOuter} fill={COLORS.baseDark} />

      {/* Segments */}
      <g>
        {Array.from({ length: 20 }).map((_, i) => {
          const start = i * 18 - 9; // center the first segment (20) at top
          const end = start + 18;
          const singleColorOuter = i % 2 === 0 ? COLORS.baseDark : COLORS.baseLight;
          const singleColorInner = i % 2 === 0 ? COLORS.baseDark : COLORS.baseLight;
          const ringColor = i % 2 === 0 ? COLORS.ringGreen : COLORS.ringRed; // typical alternation

          return (
            <g key={i}>
              {/* Double ring */}
              <path d={annularSectorPath(R.doubleInner, R.doubleOuter, start, end)} fill={ringColor} />
              {/* Outer single */}
              <path d={annularSectorPath(R.tripleOuter, R.doubleInner, start, end)} fill={singleColorOuter} />
              {/* Triple ring */}
              <path d={annularSectorPath(R.tripleInner, R.tripleOuter, start, end)} fill={ringColor} />
              {/* Inner single */}
              <path d={annularSectorPath(R.outerBull, R.tripleInner, start, end)} fill={singleColorInner} />
            </g>
          );
        })}
      </g>

      {/* Bulls */}
      <circle r={R.outerBull} fill={COLORS.bullGreen} />
      <circle r={R.innerBull} fill={COLORS.bullRed} />

      {/* Wires: radial separators */}
      <g stroke={COLORS.wire} strokeWidth={1.5} strokeLinecap="round" opacity={0.9}>
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = i * 18 - 9; // boundary lines
          const rad = (angle - 90) * Math.PI / 180;
          const xOut = R.doubleOuter * Math.cos(rad);
          const yOut = R.doubleOuter * Math.sin(rad);
          const xIn = R.outerBull * Math.cos(rad);
          const yIn = R.outerBull * Math.sin(rad);
          return <line key={i} x1={xIn} y1={yIn} x2={xOut} y2={yOut} />;
        })}
        {/* Ring wires */}
        <circle r={R.doubleOuter} fill="none" />
        <circle r={R.doubleInner} fill="none" />
        <circle r={R.tripleOuter} fill="none" />
        <circle r={R.tripleInner} fill="none" />
        <circle r={R.outerBull} fill="none" />
        <circle r={R.innerBull} fill="none" />
      </g>

      {/* Number ring */}
      <g fontFamily="system-ui, ui-sans-serif, -apple-system, Segoe UI, Roboto" fontSize={26} fill={COLORS.number}>
        {SEGMENT_ORDER.map((num, i) => {
          const angle = i * 18; // center of the segment
          return (
            <g key={num} transform={`rotate(${angle})`}>
              <text x={0} y={-(R.numberRingRadius)} textAnchor="middle" dominantBaseline="middle">
                {num}
              </text>
            </g>
          );
        })}
      </g>

      {/* Gloss subtle highlight */}
      <defs>
        <radialGradient id="gloss" cx="50%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={R.doubleOuter} fill="url(#gloss)" />
    </svg>
  );
}
