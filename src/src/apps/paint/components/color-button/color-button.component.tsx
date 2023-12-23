import React, { useState } from 'react';
import css from './color-button.module.css'

interface Props {
  radius: number;
  color?: string;
  onSelect: () => void;
}

export const ColorButton: React.FC<Props> = ({
  radius,
  onSelect,
  color
}) => {
  const [random, setRandom] = useState(0.5 + Math.random() * 0.5);
  const [animating, setAnimating] = useState(false)

  const numPoints = 30;

  const wobblyRadius = 5;
  const wobblyMulti = 12;
  const wobblyF1 = 0.3;
  const wobblyF2 = 0.7;

  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 * i) / numPoints;

    const add = Math.sin(angle * wobblyMulti * random) * wobblyRadius * wobblyF1;
    const add2 = Math.sin(angle * wobblyMulti * random / 4) * wobblyRadius * wobblyF2;

    const x = Math.cos(angle) * (radius - wobblyRadius + add + add2);
    const y = Math.sin(angle) * (radius - wobblyRadius + add + add2) * 0.8;

    points.push(`L${x} ${y}`);
  }

  const path = `M${points[0].slice(1)} ${points.slice(1).join(' ')} Z`;

  const onClick = (e: React.MouseEvent | React.TouchEvent) => {
    setAnimating(i => !i)
    setRandom(Math.random())
    onSelect()
  }

  return (
    <svg
      className={`${css.button} ${animating ? css.animate : ''}`}
      width={radius * 2}
      height={radius * 2}
      viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
      onPointerDown={onClick}
    >
      <path d={path} fill={color} />
    </svg>
  );
};
