import React from "react";
import type { StallDiagnosticRow } from "../../types/forms";
import styles from "./ParallelsStall.module.css";
interface ParallelsStallProps {
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
  dmb_type?: "parallel" | "herringbone";
  row?: "left" | "right"; // для ёлочки
}

const ParallelsStall: React.FC<ParallelsStallProps> = ({
  data,
  averages,
  dmb_type = "parallel",
  row = "right",
}) => {
  const isZero =
    (data.total_milk_production ?? 0) === 0 

  const isBelowThreshold =
    !isZero &&
    ((data.total_milk_production ?? 0) <=
      0.5 * (averages.avgMilkProduction ?? 0) ||
      (data.number_reattaches ?? 0) >= 1.5 * (averages.avgReattaches ?? 0) &&
        (data.number_reattaches ?? 0) > 4 ||
      (data.manual_detach_count ?? 0) >= 1.5 * (averages.avgManualDetaches ?? 0) &&
        (data.manual_detach_count ?? 0) > 4 ||
      (data.manual_mode_count ?? 0) >= 1.5 * (averages.avgManualModes ?? 0) &&
        (data.manual_mode_count ?? 0) > 4);

  const fillColor = isZero ? "#B0B0B0" : isBelowThreshold ? "#f48fb1" : "#90caf9";

  // определяем угол поворота
  let rotation = 0;
  if (dmb_type === "herringbone") {
    rotation = row === "left" ? -45 : 45;
  }

  return (
    <div
      className={styles.stall}
      style={{
        background: fillColor,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: row === "left" ? "top left" : "top right",
        marginBottom: dmb_type === "herringbone" ? "25px" : undefined,
      }}
      title={`Стойло ${data.meter_address}`}
    >
      <span>{data.meter_address}</span>
    </div>
  );
};
export default ParallelsStall;
