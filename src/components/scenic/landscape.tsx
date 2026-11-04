import styles from "./scenic.module.css";

export function MountainLandscape() {
  return (
    <svg
      className={styles.landscape}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="scenic-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--landscape-sky, #F5E8D9)" />
          <stop offset="1" stopColor="var(--background)" />
        </linearGradient>
        <linearGradient id="scenic-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--background)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--background)" stopOpacity=".32" />
        </linearGradient>
      </defs>
      <path fill="url(#scenic-sky)" d="M0 0h1440v760H0Z" />
      <g className={styles.sun}>
        <circle cx="1230" cy="145" r="53" fill="#D4AF78" opacity=".6" />
        <circle
          cx="1230"
          cy="145"
          r="66"
          fill="none"
          stroke="#D4AF78"
          strokeOpacity=".15"
        />
      </g>
      <g className={styles.moon}>
        <circle cx="1230" cy="145" r="43" fill="#D4AF78" />
        <circle
          cx="1248"
          cy="131"
          r="38"
          fill="var(--landscape-sky, #30203B)"
        />
      </g>
      <g className={styles.stars} fill="#F6EDE3">
        <circle cx="119" cy="141" r="1.5" />
        <circle cx="331" cy="84" r="1.6" />
        <circle cx="1030" cy="85" r="1.5" />
        <circle cx="1362" cy="268" r="1.8" />
        <circle cx="1116" cy="256" r="1" />
        <path d="m229 216 2-6 2 6 6 2-6 2-2 6-2-6-6-2zm1073-149 2-6 2 6 6 2-6 2-2 6-2-6-6-2z" />
      </g>
      <path
        d="M0 482 133 291 273 447 429 238 580 438 747 352 925 474 1125 259 1300 433 1440 283V760H0Z"
        fill="var(--mountain-far, #C7AF96)"
        opacity=".64"
      />
      <path
        d="m133 291-57 133 56-40 35 28 23-36 41 39zm296-53-73 158 61-51 38 26 31-38 57 91zm696 21-81 162 79-47 50 36 29-27 44 40zm315 24-74 142 75-59"
        fill="var(--background)"
        opacity=".72"
      />
      <path
        d="M0 594 147 449 335 590 488 448 690 610 865 456 1073 593 1222 455 1440 568V760H0Z"
        fill="var(--mountain-near, #A18B77)"
        opacity=".55"
      />
      <path
        d="M0 677 216 568 453 685 653 590 873 690 1148 562 1440 670V760H0Z"
        fill="var(--secondary)"
        opacity=".36"
      />
      <path
        d="M0 731c178-100 356 52 552-18s358-52 497-5 285-36 391-5v57H0Z"
        fill="var(--primary)"
        opacity=".13"
      />
      <g fill="var(--foreground)" opacity=".58">
        <path d="m29 602 29-70 29 70H69l27 42H68v67H49v-67H20l28-42zm1322-40 32-80 32 80h-22l31 48h-31v91h-21v-91h-32l30-48zm69 54 20-49 20 49h-14l19 31h-20v47h-12v-47h-19l19-31z" />
      </g>
      <path fill="url(#scenic-haze)" d="M0 470h1440v290H0Z" />
    </svg>
  );
}
