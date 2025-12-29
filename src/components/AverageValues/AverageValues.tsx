import React from "react";
import styles from "./AverageValues.module.css";

interface AverageValuesProps {
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

const MetricCard = ({
  title,
  avg,
  total,
  unit,
}: {
  title: string;
  avg: number | null;
  total: number | null;
  unit: string;
}) => (
  <div className={styles.card}>
    <span className={styles.label}>{title}</span>

    <div className={styles.row}>
      <span className={styles.subLabel}>Среднее</span>
      <span className={styles.value}>
          {total === 0
            ? "-"
            : avg !== null
              ? `${avg.toFixed(0)} ${unit}`
              : "—"}
      </span>
    </div>

    <div className={styles.row}>
      <span className={styles.subLabel}>Всего</span>
      <span className={styles.total}>
        {total !== null && total !== 0
        ? `${total.toFixed(0)} ${unit}`
        : "-"}
      </span>
    </div>
  </div>
);

const AverageValues: React.FC<AverageValuesProps> = ({ averages }) => {
  return (
    <div className={styles.container}>
      <MetricCard
        title="Молоко"
        avg={averages.avgMilkProduction}
        total={averages.total_milk_production}
        unit="кг"
      />

      <MetricCard
        title="Отгрузки"
        avg={averages.avgAmountWashed}
        total={averages.total_amount_washed}
        unit="ед"
      />

      <MetricCard
        title="Переподключения"
        avg={averages.avgReattaches}
        total={averages.number_reattaches}
        unit="ед"
      />

      <MetricCard
        title="Ручные отключения"
        avg={averages.avgManualDetaches}
        total={averages.manual_detach_count}
        unit="ед"
      />

      <MetricCard
        title="Ручные режимы"
        avg={averages.avgManualModes}
        total={averages.manual_mode_count}
        unit="ед"
      />
    </div>
  );
};

export default AverageValues;
