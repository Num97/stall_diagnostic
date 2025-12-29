import React, {useState, useEffect} from "react";
import styles from "./StallCardsHeader.module.css";
import { getMetersToShow } from "../../utils/meters_to_show";
import type { StallDiagnosticRow } from "../../types/forms";

interface StallCardsHeaderProps {
  rows: StallDiagnosticRow[];
  averages: { avgMilkProduction: number | null; avgAmountWashed: number | null, total_milk_production: number | null, total_amount_washed: number | null , avgReattaches: number | null, avgManualDetaches: number | null, avgManualModes: number | null, number_reattaches: number | null, manual_detach_count: number | null, manual_mode_count: number | null };
  setMeters: React.Dispatch<React.SetStateAction<number[]>>;
  onTabChange?: (tabLabel: string) => void;
}

type Tab = "all" | "good" | "bad" | "empty" | "bad_empty";

const tabs: { label: string; filter: Tab }[] = [
  { label: "Все стойла", filter: "all" },
  { label: "В порядке", filter: "good" },
  { label: "Отклонение", filter: "bad" },
  { label: "Отсутствует показатель", filter: "empty" },
  { label: "Проблемы", filter: "bad_empty" },
];

const StallCardsHeader: React.FC<StallCardsHeaderProps> = ({ rows, averages, setMeters, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>("bad_empty");

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    const metersToShow = getMetersToShow(rows, averages, tab);
    setMeters(metersToShow);
  };

  useEffect(() => {
    const tabLabel = tabs.find(t => t.filter === activeTab)?.label ?? "";
    onTabChange?.(tabLabel);
  }, [activeTab]);

  React.useEffect(() => {
    // при загрузке показываем выбранный по умолчанию таб
    const metersToShow = getMetersToShow(rows, averages, activeTab);
    setMeters(metersToShow);
  }, [rows, averages, activeTab, setMeters]);

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.filter}
          className={`${styles.tabButton} ${activeTab === tab.filter ? styles.active : ""}`}
          onClick={() => handleTabClick(tab.filter)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default StallCardsHeader;