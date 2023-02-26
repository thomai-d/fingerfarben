import React, { useState } from 'react';

interface CircleProps {
  radius: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  onSelect: () => void;
}

export const ColorButton: React.FC<CircleProps> = ({
  radius,
  onSelect,
  fillColor = 'transparent',
  strokeColor = 'black',
  strokeWidth = 1,
}) => {
  const [random, setRandom] = useState(Math.random());

  const numPoints = 30;
  const wobblyRadius = 5;
  const wobblyMulti = 8;

  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 * i) / numPoints;
    const add = Math.sin(angle * wobblyMulti * random) * wobblyRadius;
    const x = Math.cos(angle) * (radius - wobblyRadius + add);
    const y = Math.sin(angle) * (radius - wobblyRadius + add);
    points.push(`${x},${y}`);
  }

  const path = `M${points[0]} C${points.slice(1).join(' ')}`;

  const onClick = (e: React.MouseEvent | React.TouchEvent) => {
    setRandom(Math.random())
    onSelect()
  }

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
      onClick={onClick}
      onTouchStart={onClick}
      onTouchEnd={e => e.preventDefault()}
    >
      <path d={path} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
    </svg>
  );
};
