import React, { useState } from "react";
import type { StallDiagnosticRow } from "../../types/forms";
import styles from "./StallCards.module.css";
import StallCardsHeader from "../StallCardsHeader/StallCardsHeader";
import { getMetersToShow } from "../../utils/meters_to_show";
import AverageValues from "../AverageValues/AverageValues";

interface StallCardsProps {
  data: StallDiagnosticRow[];
  meters: number[];
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
  setMeters: React.Dispatch<React.SetStateAction<number[]>>;
}

const StallCards: React.FC<StallCardsProps> = ({ data, meters, averages, setMeters }) => {
  const [activeTabLabel, setActiveTabLabel] = useState<string>("Проблемы");
  const filtered = data.filter(
    (row) => row.meter_address && meters.includes(row.meter_address)
  );

  // заранее определяем категории по той же логике
  const badMeters = getMetersToShow(data, averages, "bad");
  const emptyMeters = getMetersToShow(data, averages, "empty");
  const goodMeters = getMetersToShow(data, averages, "good");

  return (
    <div className={styles.wrapper}>
      <StallCardsHeader rows={data} averages={averages} setMeters={setMeters}
        onTabChange={(tabLabel) => setActiveTabLabel(tabLabel)}
      />
      <AverageValues averages={averages} />
      <div className={styles.container}>
        {filtered.length === 0 ? (
          <p className={styles.noData}>Стойла признаком `{activeTabLabel}` отсутствуют</p>
        ) : (
          filtered.map((row) => {
            const meter = row.meter_address!;
            let statusClass = "";

            if (emptyMeters.includes(meter)) statusClass = styles.empty;
            else if (badMeters.includes(meter)) statusClass = styles.bad;
            else if (goodMeters.includes(meter)) statusClass = styles.good;

            const milk = row.total_milk_production ?? 0;
            const wash = row.total_amount_washed ?? 0;
            const reattaches = row.number_reattaches;
            const manualDetaches = row.manual_detach_count;
            const manualModes = row.manual_mode_count;

            const hasReattaches = reattaches !== null && reattaches !== undefined;
            const hasManualDetaches = manualDetaches !== null && manualDetaches !== undefined;
            const hasManualModes = manualModes !== null && manualModes !== undefined;

            const reattachesIsZero = hasReattaches && reattaches === 0;
            const manualDetachesIsZero = hasManualDetaches && manualDetaches === 0;
            const manualModesIsZero = hasManualModes && manualModes === 0;

            const milkIsZero = milk === 0;
            const washIsZero = wash === 0;

            const milkBelow = !milkIsZero && milk <= 0.5 * (averages.avgMilkProduction ?? 0);
            const washBelow = !washIsZero && wash <= 0.7 * (averages.avgAmountWashed ?? 0);

            const reattachesBelow =
              hasReattaches &&
              !reattachesIsZero &&
              reattaches >= 1.5 * (averages.avgReattaches ?? 0) &&
              reattaches > 4;

            const manualDetachesBelow =
              hasManualDetaches &&
              !manualDetachesIsZero &&
              manualDetaches >= 1.5 * (averages.avgManualDetaches ?? 0) &&
              manualDetaches > 4;
            const manualModesBelow =
              hasManualModes &&
              !manualModesIsZero &&
              manualModes >= 1.5 * (averages.avgManualModes ?? 0) &&
              manualModes > 4;


            return (
              <div key={row.id} className={`${styles.card} ${statusClass}`}>
                <div className={styles.header}>
                  <span className={styles.meterNumber}>№ {meter}</span>
                </div>

                <div className={styles.content}>
                  <div className={styles.metric}>
                    <span className={styles.label}>Молоко</span>
                    <span
                      className={`${styles.value} ${
                        milkIsZero
                          ? styles.emptyValue
                          : milkBelow
                          ? styles.badValue
                          : styles.goodValue
                      }`}
                    >
                      {milk ? milk.toFixed(1) : "—"} кг
                    </span>
                  </div>

                  <div className={styles.metric}>
                    <span className={styles.label}>Отгрузки</span>
                    <span
                      className={`${styles.value} ${
                        washIsZero
                          ? styles.emptyValue
                          : washBelow
                          ? styles.badValue
                          : styles.goodValue
                      }`}
                    >
                      {wash ? wash.toFixed(0) : "—"} ед
                    </span>
                  </div>
                  
                  <div className={styles.metric}>
                    <span className={styles.label}>Переподключения</span>
                    <span
                      className={`${styles.value} ${
                        reattaches === undefined || reattaches === null 
                          ? styles.emptyValue
                          : reattachesBelow
                          ? styles.badValue
                          : styles.goodValue
                      }`}
                    >
                      {reattaches !== null && reattaches !== undefined
                        ? reattaches.toFixed(0)
                        : "—"} ед
                    </span>
                  </div>

                  
                  <div className={styles.metric}>    
                    <span className={styles.label}>Ручные отключения</span>
                    <span
                      className={`${styles.value} ${
                        manualDetaches === undefined || manualDetaches === null
                          ? styles.emptyValue
                          : manualDetachesBelow
                          ? styles.badValue
                          : styles.goodValue
                      }`}
                    >
                      {manualDetaches !== null && manualDetaches !== undefined
                        ? manualDetaches.toFixed(0)
                        : "—"} ед
                    </span>
                  </div>    
                  <div className={styles.metric}>    
                    <span className={styles.label}>Ручные режимы</span>
                    <span
                      className={`${styles.value} ${
                        manualModes === undefined || manualModes === null
                          ? styles.emptyValue
                          : manualModesBelow
                          ? styles.badValue
                          : styles.goodValue
                      }`}
                    >
                      {manualModes !== null && manualModes !== undefined
                        ? manualModes.toFixed(0)
                        : "—"} ед
                    </span>
                  </div>    

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StallCards;
