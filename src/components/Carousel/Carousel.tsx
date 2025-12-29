import Stall from "../Stall/Stall";
import styles from "./Carousel.module.css";
import type { StallDiagnosticRow } from "../../types/forms";

interface CarouselProps {
  data: StallDiagnosticRow[];
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

const Carousel: React.FC<CarouselProps> = ({ data, averages }) => {
  const totalStalls = data.length; // теперь зависит от данных
  const radius = 320; // внешний радиус
  const innerRadius = 200; // внутренний радиус

  // теперь создаём стойла из реальных данных
  const stalls = data.map((stallData, index) => (
    <Stall
      key={stallData.meter_address || index} // уникальный ключ
      number={stallData.meter_address ?? index + 1}       // номер стойла
      totalStalls={totalStalls}
      radius={radius}
      innerRadius={innerRadius}
      data={stallData}
      averages={averages}
    />
  ));

  return (
    <div className={styles.carousel}>
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
      >
        {stalls}
      </svg>
    </div>
  );
};

export default Carousel;
