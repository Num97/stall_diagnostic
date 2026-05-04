import React from "react";
import type { StallDiagnosticRow } from "../../types/forms";
import styles from './Stall.module.css'

interface StallProps {
  number: number; // номер сегмента (обычно meter_address)
  totalStalls: number;
  radius: number;
  innerRadius?: number;
  data: StallDiagnosticRow;
  averages: {
    avgMilkProduction: number | null;
    avgAmountWashed: number | null;
    avgReattaches: number | null;
    avgManualDetaches: number | null;
    avgManualModes: number | null;
    total_milk_production: number | null;
    total_amount_washed: number | null;
    number_reattaches: number | null;
    manual_detach_count: number | null;
    manual_mode_count: number | null;
  };
}

const Stall: React.FC<StallProps> = ({
  number,
  totalStalls,
  radius,
  innerRadius = 0,
  data,
  averages,
}) => {
  const anglePerStall = 360 / totalStalls;
  const startAngle = (number - 1) * anglePerStall;
  const endAngle = number * anglePerStall;

  const polarToCartesian = (r: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: r * Math.cos(angleRad),
      y: r * Math.sin(angleRad),
    };
  };

  const outerStart = polarToCartesian(radius, endAngle);
  const outerEnd = polarToCartesian(radius, startAngle);
  const innerStart = polarToCartesian(innerRadius, startAngle);
  const innerEnd = polarToCartesian(innerRadius, endAngle);

  const d = `
    M ${outerStart.x} ${outerStart.y}
    A ${radius} ${radius} 0 0 0 ${outerEnd.x} ${outerEnd.y}
    L ${innerStart.x} ${innerStart.y}
    A ${innerRadius} ${innerRadius} 0 0 1 ${innerEnd.x} ${innerEnd.y}
    Z
  `;

  const midAngle = startAngle + anglePerStall / 2;
  const textPos = polarToCartesian((radius + innerRadius) / 2, midAngle);

  // проверяем условия
  const isZero = (data.total_milk_production ?? 0) === 0;

  const isBelowThreshold =
    !isZero && (
      (data.total_milk_production ?? 0) <= 0.5 * (averages.avgMilkProduction ?? 0) ||
      (data.number_reattaches ?? 0) >= 1.5 * (averages.avgReattaches ?? 0) &&
        (data.number_reattaches ?? 0) > 9 ||
      (data.manual_detach_count ?? 0) >= 1.5 * (averages.avgManualDetaches ?? 0) &&
        (data.manual_detach_count ?? 0) > 9 ||
      (data.manual_mode_count ?? 0) >= 1.5 * (averages.avgManualModes ?? 0) &&
        (data.manual_mode_count ?? 0) > 9
    );

  // цвет сегмента
  const fillColor = isZero ? "#B0B0B0" : isBelowThreshold ? "#f48fb1" : "#90caf9";

  return (
    <g className={styles.stall}>
      {/* Градиент сегмента */}
      <defs>
        <radialGradient id={`grad-${number}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fefefe" />
          <stop offset="50%" stopColor={fillColor} />
          <stop offset="100%" stopColor="#eeeeee" />
        </radialGradient>
      </defs>

      {/* Сегмент */}
      <path d={d} fill={`url(#grad-${number})`} stroke="#fff" strokeWidth="1" />

      {/* Тень для объёма */}
      <path
        d={d}
        fill="black"
        opacity={0.1}
        transform="translate(2,2)"
      />

      {/* Номер стойла */}
      <text
        x={textPos.x}
        y={textPos.y}
        fill="#000000"
        stroke="#000000"
        strokeWidth="0"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {data.meter_address}
      </text>
    </g>
  );
};

export default Stall;
