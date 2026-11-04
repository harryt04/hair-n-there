import { Wagon } from "./wagon";
import styles from "./scenic.module.css";

export function RoadBand({ chapter }: { chapter: string }) {
  return (
    <div className={styles.roadBand} aria-hidden="true">
      <div className={styles.roadCaption}>{chapter}</div>
      <svg
        data-journey-road
        className={styles.desktopRoad}
        viewBox="0 0 1200 190"
        focusable="false"
      >
        <path
          className={styles.roadShoulder}
          d="M60 112C240 25 380 165 580 103S916 29 1138 110"
        />
        <path
          data-route
          className={styles.roadDashes}
          d="M60 112C240 25 380 165 580 103S916 29 1138 110"
        />
        <g data-car transform="translate(60 112) rotate(-12)">
          <Wagon />
        </g>
        <path
          d="m90 137 11-20 11 20h-7v13h-8v-13zm919-49 15-28 15 28h-10v17h-10V88"
          fill="var(--secondary)"
          opacity=".35"
        />
      </svg>
      <svg
        data-journey-road
        className={styles.mobileRoad}
        viewBox="0 0 360 138"
        focusable="false"
      >
        <path
          className={styles.roadShoulder}
          d="M30 88C105 20 174 119 232 76S300 65 332 87"
        />
        <path
          data-route
          className={styles.roadDashes}
          d="M30 88C105 20 174 119 232 76S300 65 332 87"
        />
        <g data-car transform="translate(30 88) rotate(-12) scale(.58)">
          <g className={styles.mobileWagon}>
            <Wagon />
          </g>
        </g>
      </svg>
    </div>
  );
}
