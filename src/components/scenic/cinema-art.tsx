// Original SVG studies informed by Subaru’s 2020 Outback launch photography.
// https://www.subaru.co.jp/press/news-en/2019_04_18_7147/
// Black body, snowboard, and styling kit are brand artwork; no vehicle salon is offered.
import type { CinemaVariant } from "@/data/cinema";

export function CinemaLandscape({ variant }: { variant: CinemaVariant }) {
  if (variant === "alpine-local")
    return (
      <>
        <rect width="1000" height="300" fill="var(--cinema-sky)" />
        <ellipse
          data-orb=""
          cx="850"
          cy="45"
          rx="29"
          ry="29"
          fill="#d4af78"
          opacity=".7"
        />
        <g data-layer="far">
          <path
            d="M-200 190-50 90 100 170 280 15 460 175 600 50 800 185 990 38 1200 175 1400 80V300H-200Z"
            fill="var(--mountain-far)"
          />
          <path
            d="m280 15-68 124 63-45 28 28 21-27 46 47Zm710 23-56 100 50-39 28 23 25-27 47 49"
            fill="var(--cinema-snow)"
            opacity=".85"
          />
        </g>
        <g data-layer="near">
          <path
            d="M-200 244 15 134 180 230 370 145 570 238 770 140 970 230 1170 140 1450 240V300H-200Z"
            fill="var(--mountain-near)"
            opacity=".8"
          />
        </g>
        <g data-layer="neighborhood">
          <g transform="translate(5 206) scale(0.6)">
            <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
            <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          </g>
          <g transform="translate(230 205) scale(0.5)">
            <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
            <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          </g>
          <g transform="translate(620 205) scale(0.7)">
            <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
            <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          </g>
          <g transform="translate(970 216) scale(0.8)">
            <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
            <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          </g>
          <g transform="translate(1280 207) scale(0.65)">
            <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
            <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          </g>
          <g transform="translate(360 210)">
            <path d="M-59-65 8-79 63-62v7H-59Z" fill="#70556c" />
            <path d="M-53-55H55V10H-53Z" fill="#b18f91" />
            <path
              d="M-41-43h31v24h-31zm55 8h14v45H14Zm28-8h7v24h-7Z"
              fill="#f6dfb7"
            />
            <path d="M-60 10H62" stroke="#70556c" strokeWidth="4" />
            <path d="M21 12v17" stroke="#c7af96" strokeWidth="10" />
          </g>
          <g transform="translate(810 205)">
            <path d="M-59-65 8-79 63-62v7H-59Z" fill="#70556c" />
            <path d="M-53-55H55V10H-53Z" fill="#b18f91" />
            <path
              d="M-41-43h31v24h-31zm55 8h14v45H14Zm28-8h7v24h-7Z"
              fill="#f6dfb7"
            />
            <path d="M-60 10H62" stroke="#70556c" strokeWidth="4" />
            <path d="M21 12v17" stroke="#c7af96" strokeWidth="10" />
          </g>
          <g transform="translate(1090 213)">
            <path d="M-59-65 8-79 63-62v7H-59Z" fill="#70556c" />
            <path d="M-53-55H55V10H-53Z" fill="#b18f91" />
            <path
              d="M-41-43h31v24h-31zm55 8h14v45H14Zm28-8h7v24h-7Z"
              fill="#f6dfb7"
            />
            <path d="M-60 10H62" stroke="#70556c" strokeWidth="4" />
            <path d="M21 12v17" stroke="#c7af96" strokeWidth="10" />
          </g>
        </g>
      </>
    );
  if (variant === "night-shift")
    return (
      <>
        <rect width="1000" height="300" fill="#21172d" />
        <rect x="55" y="38" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <rect x="175" y="64" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <rect x="300" y="28" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <rect x="390" y="74" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <rect x="545" y="43" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <rect x="720" y="34" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <rect x="910" y="62" width="3" height="3" fill="#ead8bf" opacity=".6" />
        <path d="M845 27h28v6h7v28h-7v7h-28v-7h-7V33h7Z" fill="#d4af78" />
        <path d="M852 22h28v28h-7v7h-21Z" fill="#21172d" />
        <g data-layer="far" shapeRendering="crispEdges">
          <path
            d="M-200 160h120v-20h40v-20H0v-20h40V80h40V60h40v20h40v20h40v20h40v20h40v20h80v-30h35v-25h35V80h35V55h35v25h35v25h35v25h35v30h130v-30h40v-30h40V70h40V45h40v25h40v30h40v30h40v30h200v140H-200Z"
            fill="#5b425d"
          />
          <path
            d="M80 60h40v20h40v20h-40V86H80V100H40V80h40Zm385-5h35v25h35v25h-35V90h-35v15h-35V80h35Z"
            fill="#c2a9b8"
          />
        </g>
        <g data-layer="near">
          <path
            d="M-200 235h100v-20H30v-20H180v20H300v-30H440v30H600v-20H750v20H900v-25h140v25h180v85H-200Z"
            fill="#39283f"
          />
        </g>
        <g data-layer="neighborhood">
          <g transform="translate(5 206) scale(0.6)" fill="#544256">
            <path d="M-5-65h10v10h7v10h7v10h-7v8h12v10h8V0H-33v-17h8v-10h12v-8h-7v-10h8v-10h7Z" />
            <path d="M-4 0h8v15h-8Z" fill="#2e2535" />
          </g>
          <g transform="translate(230 205) scale(0.5)" fill="#544256">
            <path d="M-5-65h10v10h7v10h7v10h-7v8h12v10h8V0H-33v-17h8v-10h12v-8h-7v-10h8v-10h7Z" />
            <path d="M-4 0h8v15h-8Z" fill="#2e2535" />
          </g>
          <g transform="translate(620 205) scale(0.7)" fill="#544256">
            <path d="M-5-65h10v10h7v10h7v10h-7v8h12v10h8V0H-33v-17h8v-10h12v-8h-7v-10h8v-10h7Z" />
            <path d="M-4 0h8v15h-8Z" fill="#2e2535" />
          </g>
          <g transform="translate(970 216) scale(0.8)" fill="#544256">
            <path d="M-5-65h10v10h7v10h7v10h-7v8h12v10h8V0H-33v-17h8v-10h12v-8h-7v-10h8v-10h7Z" />
            <path d="M-4 0h8v15h-8Z" fill="#2e2535" />
          </g>
          <g transform="translate(1280 207) scale(0.65)" fill="#544256">
            <path d="M-5-65h10v10h7v10h7v10h-7v8h12v10h8V0H-33v-17h8v-10h12v-8h-7v-10h8v-10h7Z" />
            <path d="M-4 0h8v15h-8Z" fill="#2e2535" />
          </g>
          <g transform="translate(360 210)" shapeRendering="crispEdges">
            <path d="M-62-52h9v-9h110v9h8v8H-62Z" fill="#d4af78" />
            <path d="M-53-44H57V6H-53Z" fill="#4b3651" />
            <path
              d="M-40-33h27v22h-27zm41 0h13v33H1Zm25 0h22v22H26Z"
              fill="#e7c79b"
            />
            <path d="M-62 6H65v6H-62Z" fill="#795d72" />
            <path d="M8 12v17" stroke="#b18f72" strokeWidth="12" />
          </g>
          <g transform="translate(810 205)" shapeRendering="crispEdges">
            <path d="M-62-52h9v-9h110v9h8v8H-62Z" fill="#d4af78" />
            <path d="M-53-44H57V6H-53Z" fill="#4b3651" />
            <path
              d="M-40-33h27v22h-27zm41 0h13v33H1Zm25 0h22v22H26Z"
              fill="#e7c79b"
            />
            <path d="M-62 6H65v6H-62Z" fill="#795d72" />
            <path d="M8 12v17" stroke="#b18f72" strokeWidth="12" />
          </g>
          <g transform="translate(1090 213)" shapeRendering="crispEdges">
            <path d="M-62-52h9v-9h110v9h8v8H-62Z" fill="#d4af78" />
            <path d="M-53-44H57V6H-53Z" fill="#4b3651" />
            <path
              d="M-40-33h27v22h-27zm41 0h13v33H1Zm25 0h22v22H26Z"
              fill="#e7c79b"
            />
            <path d="M-62 6H65v6H-62Z" fill="#795d72" />
            <path d="M8 12v17" stroke="#b18f72" strokeWidth="12" />
          </g>
        </g>
      </>
    );
  return (
    <>
      <rect width="1000" height="300" fill="var(--cinema-sky)" />
      <ellipse
        data-orb=""
        cx="850"
        cy="42"
        rx="25"
        ry="25"
        fill="#e8b5b8"
        opacity=".65"
      />
      <g data-layer="far">
        <path
          d="M-200 190-90 112 60 175 225 15 390 170 535 65 680 176 825 34 1000 170 1240 43 1450 190V300H-200Z"
          fill="#c1b7c4"
        />
        <path
          d="m225 15-74 126 65-45 33 28 21-28 49 43Zm600 19-62 112 58-42 27 28 24-27 46 41"
          fill="#f9f4ed"
        />
      </g>
      <g data-layer="near">
        <path
          d="M-200 249 0 155 180 225 365 131 565 230 760 160 940 230 1125 126 1450 249V300H-200Z"
          fill="#aa9aaa"
        />
        <path
          d="M-200 250 0 177 180 240 365 151 565 245 760 180 940 247 1125 147 1450 260V300H-200Z"
          fill="#eee6e2"
        />
      </g>
      <g data-layer="neighborhood">
        <g transform="translate(5 206) scale(0.6)">
          <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
          <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          <path
            d="M0-76-11-54H11Z M0-47-18-19H18Z"
            fill="#f6ede3"
            opacity=".85"
          />
        </g>
        <g transform="translate(230 205) scale(0.5)">
          <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
          <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          <path
            d="M0-76-11-54H11Z M0-47-18-19H18Z"
            fill="#f6ede3"
            opacity=".85"
          />
        </g>
        <g transform="translate(620 205) scale(0.7)">
          <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
          <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          <path
            d="M0-76-11-54H11Z M0-47-18-19H18Z"
            fill="#f6ede3"
            opacity=".85"
          />
        </g>
        <g transform="translate(970 216) scale(0.8)">
          <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
          <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          <path
            d="M0-76-11-54H11Z M0-47-18-19H18Z"
            fill="#f6ede3"
            opacity=".85"
          />
        </g>
        <g transform="translate(1280 207) scale(0.65)">
          <path d="M0-76-23-34h11L-32 0H32L12-34h11Z" fill="var(--pine)" />
          <path d="M-4-2h8v18h-8Z" fill="var(--pine)" />
          <path
            d="M0-76-11-54H11Z M0-47-18-19H18Z"
            fill="#f6ede3"
            opacity=".85"
          />
        </g>
        <g transform="translate(360 210)">
          <path
            d="M-54-48 0-88 57-48"
            fill="none"
            stroke="#a5989e"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path d="M-48-48 0-83 51-48V10H-48Z" fill="#8c7378" />
          <path d="M-59-51 0-96 63-51 55-43 0-82-51-43Z" fill="#f6ede3" />
          <path
            d="M-35-31h21v22h-21zm48 0h22v22H13Zm-17 10H8V10H-4Z"
            fill="#ead4ac"
          />
          <path d="M-57 10H60" stroke="#f6ede3" strokeWidth="8" />
        </g>
        <g transform="translate(810 205)">
          <path
            d="M-54-48 0-88 57-48"
            fill="none"
            stroke="#a5989e"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path d="M-48-48 0-83 51-48V10H-48Z" fill="#8c7378" />
          <path d="M-59-51 0-96 63-51 55-43 0-82-51-43Z" fill="#f6ede3" />
          <path
            d="M-35-31h21v22h-21zm48 0h22v22H13Zm-17 10H8V10H-4Z"
            fill="#ead4ac"
          />
          <path d="M-57 10H60" stroke="#f6ede3" strokeWidth="8" />
        </g>
        <g transform="translate(1090 213)">
          <path
            d="M-54-48 0-88 57-48"
            fill="none"
            stroke="#a5989e"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path d="M-48-48 0-83 51-48V10H-48Z" fill="#8c7378" />
          <path d="M-59-51 0-96 63-51 55-43 0-82-51-43Z" fill="#f6ede3" />
          <path
            d="M-35-31h21v22h-21zm48 0h22v22H13Zm-17 10H8V10H-4Z"
            fill="#ead4ac"
          />
          <path d="M-57 10H60" stroke="#f6ede3" strokeWidth="8" />
        </g>
      </g>
    </>
  );
}

export function OutbackArtwork({ variant }: { variant: CinemaVariant }) {
  if (variant === "alpine-local")
    return (
      <>
        <g>
          <ellipse
            cx="0"
            cy="49"
            rx="116"
            ry="5"
            fill="#171723"
            opacity=".22"
          />
          <path
            d="M-118 5-113-16-98-26-76-36Q-61-40-31-40H23Q38-39 49-29L68-18 101-13 115-6 120 12 116 31H99Q97 0 71 0T44 32H-53Q-55 0-80 0T-105 32H-119Z"
            fill="#171c25"
            stroke="#777a83"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="m-102-22 28-11h30v22h-61Zm64-11H23q9 0 16 6l19 16h-96Z"
            fill="#718897"
            stroke="#b8b7ba"
            strokeWidth="1.8"
          />
          <path
            d="M-74-34v22m38-20v21m60 0 3 40M-39-10l-3 40"
            stroke="#252a34"
            strokeWidth="3"
          />
          <path
            d="M-102-22-75-36q34-8 98 0l36 22"
            fill="none"
            stroke="#c5c1c1"
            strokeWidth="1.4"
          />
          <path
            d="M-119 10-103 4q23-19 45 0l9 18H40L51 6q23-20 45-2l15 10h8v17h-16q-2-29-30-29T45 32h-99q-1-29-27-29t-25 29h-13Z"
            fill="#30333c"
          />
          <path d="M-46 26H39" stroke="#85868b" strokeWidth="3" />
          <path d="M-119-15-108-19-105-5-113-1h-6" fill="#d86779" />
          <path d="m96-12 17 6-1 6-20-5Z" fill="#f4e5bf" />
          <path d="m111 14 8 1-2 10h-7Z" fill="#b9b6b8" />
          <path d="M-112-29-102-32-106-24" fill="#c6bdc0" />
          <path
            d="M42-18h13l4 7-14 2Z"
            fill="#202732"
            stroke="#a9a6ad"
            strokeWidth="1.5"
          />
          <g transform="translate(0 8)">
            <path
              d="M-84-51-77-57H24l10 5M-66-51v-8M9-51v-8"
              fill="none"
              stroke="#b8b1b8"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M-88-63q-7-1-9-7h129q13 0 17-7 2 9-8 13Z"
              fill="#e8b5b8"
              stroke="#b68797"
              strokeWidth="1.6"
            />
            <path
              d="M-44-68h8v7h-8Zm47 0h8v7H3Z"
              fill="#d4af78"
              stroke="#61455d"
              strokeWidth="1"
            />
          </g>
          <path
            d="M-103-1q18-3 37 0m20 1h71m7 0h49"
            fill="none"
            stroke="#6b707a"
            strokeWidth="1.2"
          />
          <path
            d="M-38-6h12m48 0h12"
            stroke="#c1bdc4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-84-18v-8h17v12h-17m4-12v-4h9v4"
            fill="#ae8992"
            stroke="#33303c"
            strokeWidth="1.5"
          />
          <path
            d="m-14 14 5-6 5 6 6-6 5 6"
            fill="none"
            stroke="#d4af78"
            strokeWidth="1.5"
          />
          <path d="M-18 24h29" stroke="#92919a" strokeWidth="1" />
          <g transform="translate(-80 24)">
            <circle r="19" fill="#11141a" stroke="#9a9799" strokeWidth="1.5" />
            <circle r="14" fill="#4e535b" stroke="#aaa9ac" strokeWidth="1.5" />
            <g data-wheel="" fill="#c6c6c8">
              <path
                d="M0-12 2-4 10-6 5 1 10 8 2 5 0 13-3 5-11 8-5 0-10-7-2-5Z"
                transform="rotate(0)"
              />
              <circle r="4" fill="#303640" />
            </g>
          </g>
          <g transform="translate(72 24)">
            <circle r="19" fill="#11141a" stroke="#9a9799" strokeWidth="1.5" />
            <circle r="14" fill="#4e535b" stroke="#aaa9ac" strokeWidth="1.5" />
            <g data-wheel="" fill="#c6c6c8">
              <path
                d="M0-12 2-4 10-6 5 1 10 8 2 5 0 13-3 5-11 8-5 0-10-7-2-5Z"
                transform="rotate(0)"
              />
              <circle r="4" fill="#303640" />
            </g>
          </g>
        </g>
      </>
    );
  if (variant === "night-shift")
    return (
      <>
        <g shapeRendering="crispEdges">
          <ellipse cx="0" cy="48" rx="115" ry="5" fill="#151421" opacity=".3" />
          <path
            d="M-116 0h8v-18h14v-12h16v-12H28v4h14v8h12v10h23v4h25v6h12v10h6v28h-16v7H-109v-7h-11V8h4Z"
            fill="#171a22"
            stroke="#9f9a9f"
            strokeWidth="2"
          />
          <path
            d="M-91-26h18v-9h35v29h-57zm59-9H22v5h12v8h12v16h-78Z"
            fill="#8096a4"
          />
          <path d="M-31-35h4v29h-4m-39-2h4v34h-4M26-6h4v32h-4" fill="#252b35" />
          <path
            d="M-97-36h22v-5H24v5h13v5"
            fill="none"
            stroke="#c6bdbe"
            strokeWidth="2"
          />
          <path d="M-116 11h22v-5h33v7h94v-7h40v7h43v15H-116Z" fill="#30333d" />
          <path d="M-112-17h7v15h-7" fill="#d9687b" />
          <path d="M97-8h14v6h-14" fill="#f5e8ce" />
          <path
            d="M-68-47v-8m70 8v-8M-72-47H21"
            stroke="#b7b4bd"
            strokeWidth="3"
          />
          <path
            d="M-87-61h115v-4h11v8H-89v-5h2Z"
            fill="#e8b5b8"
            stroke="#b68797"
            strokeWidth="2"
          />
          <path d="M-45-62h9v7h-9zm47 0h9v7H2Z" fill="#d4af78" />
          <path
            d="M-76 3h14v14h-14v-10h14M-71 0h6v3"
            fill="#b18f72"
            stroke="#4b2e4f"
            strokeWidth="2"
          />
          <g fill="#10131c" stroke="#b7b3bd" strokeWidth="2">
            <path d="M-94 7h28v6h6v24h-6v6h-28v-6h-6V13h6Z" />
            <path d="M56 7h28v6h6v24h-6v6H56v-6h-6V13h6Z" />
          </g>
          <g fill="#b8b4bd">
            <path d="M-88 17h16v16h-16Z" />
            <path d="M62 17h16v16H62Z" />
          </g>
          <path
            d="M-83 17v16m-5-8h16m-2 2v6m141-16v16m-5-8h16"
            stroke="#555766"
            strokeWidth="3"
          />
          <path d="M-47 7h11m60 0h11" stroke="#c2bdc6" strokeWidth="2" />
          <path d="M-27 23h16v3h-16" stroke="#d4af78" strokeWidth="1" />
        </g>
      </>
    );
  return (
    <>
      <g>
        <ellipse cx="0" cy="49" rx="116" ry="5" fill="#171723" opacity=".22" />
        <path
          d="M-118 5-113-16-98-26-76-36Q-61-40-31-40H23Q38-39 49-29L68-18 101-13 115-6 120 12 116 31H99Q97 0 71 0T44 32H-53Q-55 0-80 0T-105 32H-119Z"
          fill="#171c25"
          stroke="#d6c8bf"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m-102-22 28-11h30v22h-61Zm64-11H23q9 0 16 6l19 16h-96Z"
          fill="#718897"
          stroke="#b8b7ba"
          strokeWidth="1.8"
        />
        <path
          d="M-74-34v22m38-20v21m60 0 3 40M-39-10l-3 40"
          stroke="#252a34"
          strokeWidth="3"
        />
        <path
          d="M-102-22-75-36q34-8 98 0l36 22"
          fill="none"
          stroke="#c5c1c1"
          strokeWidth="1.4"
        />
        <path
          d="M-119 10-103 4q23-19 45 0l9 18H40L51 6q23-20 45-2l15 10h8v17h-16q-2-29-30-29T45 32h-99q-1-29-27-29t-25 29h-13Z"
          fill="#30333c"
        />
        <path d="M-46 26H39" stroke="#85868b" strokeWidth="3" />
        <path d="M-119-15-108-19-105-5-113-1h-6" fill="#d86779" />
        <path d="m96-12 17 6-1 6-20-5Z" fill="#f4e5bf" />
        <path d="m111 14 8 1-2 10h-7Z" fill="#b9b6b8" />
        <path d="M-112-29-102-32-106-24" fill="#c6bdc0" />
        <path
          d="M42-18h13l4 7-14 2Z"
          fill="#202732"
          stroke="#a9a6ad"
          strokeWidth="1.5"
        />
        <g transform="translate(0 8)">
          <path
            d="M-84-51-77-57H24l10 5M-66-51v-8M9-51v-8"
            fill="none"
            stroke="#b8b1b8"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M-88-63q-7-1-9-7h129q13 0 17-7 2 9-8 13Z"
            fill="#d4af78"
            stroke="#b68797"
            strokeWidth="1.6"
          />
          <path
            d="M-44-68h8v7h-8Zm47 0h8v7H3Z"
            fill="#d4af78"
            stroke="#61455d"
            strokeWidth="1"
          />
        </g>
        <path
          d="M-103-1q18-3 37 0m20 1h71m7 0h49"
          fill="none"
          stroke="#6b707a"
          strokeWidth="1.2"
        />
        <path
          d="M-38-6h12m48 0h12"
          stroke="#c1bdc4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-84-18v-8h17v12h-17m4-12v-4h9v4"
          fill="#ae8992"
          stroke="#33303c"
          strokeWidth="1.5"
        />
        <path
          d="m-14 14 5-6 5 6 6-6 5 6"
          fill="none"
          stroke="#d4af78"
          strokeWidth="1.5"
        />
        <path d="M-18 24h29" stroke="#92919a" strokeWidth="1" />
        <g transform="translate(-80 24)">
          <circle r="19" fill="#11141a" stroke="#9a9799" strokeWidth="1.5" />
          <circle r="14" fill="#4e535b" stroke="#aaa9ac" strokeWidth="1.5" />
          <g data-wheel="" fill="#c6c6c8">
            <path
              d="M0-12 2-4 10-6 5 1 10 8 2 5 0 13-3 5-11 8-5 0-10-7-2-5Z"
              transform="rotate(0)"
            />
            <circle r="4" fill="#303640" />
          </g>
        </g>
        <g transform="translate(72 24)">
          <circle r="19" fill="#11141a" stroke="#9a9799" strokeWidth="1.5" />
          <circle r="14" fill="#4e535b" stroke="#aaa9ac" strokeWidth="1.5" />
          <g data-wheel="" fill="#c6c6c8">
            <path
              d="M0-12 2-4 10-6 5 1 10 8 2 5 0 13-3 5-11 8-5 0-10-7-2-5Z"
              transform="rotate(0)"
            />
            <circle r="4" fill="#303640" />
          </g>
        </g>
      </g>
    </>
  );
}
