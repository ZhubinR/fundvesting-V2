interface IconProps {
  color?: string;
  className?: string;
}

function NavIconFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-full p-2 border border-background-600">
      {children}
    </div>
  );
}

export function HomeIcon({ color }: IconProps) {
  return (
    <NavIconFrame>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M7.51602 2.36667L3.02435 5.86667C2.27435 6.45 1.66602 7.69167 1.66602 8.63334V14.8083C1.66602 16.7417 3.24102 18.325 5.17435 18.325H14.8244C16.7577 18.325 18.3327 16.7417 18.3327 14.8167V8.75C18.3327 7.74167 17.6577 6.45 16.8327 5.875L11.6827 2.26667C10.516 1.45 8.64102 1.49167 7.51602 2.36667Z"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M10 14.9917V12.4917" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </NavIconFrame>
  );
}

export function FundsIcon({ color }: IconProps) {
  return (
    <NavIconFrame>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5.73242 15.125V13.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 15.125V11.675" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.2676 15.125V9.94168" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M14.2658 4.875L13.8824 5.325C11.7574 7.80833 8.90742 9.56667 5.73242 10.3583"
          stroke={color} strokeWidth="1.5" strokeLinecap="round"
        />
        <path d="M11.8242 4.875H14.2659V7.30833" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M7.49935 18.3333H12.4993C16.666 18.3333 18.3327 16.6667 18.3327 12.5V7.49999C18.3327 3.33332 16.666 1.66666 12.4993 1.66666H7.49935C3.33268 1.66666 1.66602 3.33332 1.66602 7.49999V12.5C1.66602 16.6667 3.33268 18.3333 7.49935 18.3333Z"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </NavIconFrame>
  );
}

export function CompareIcon({ color }: IconProps) {
  return (
    <NavIconFrame>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M2.5 14.9833L4.62499 14.9916C5.38332 14.9916 6.09166 14.6166 6.50833 13.9916L11.8333 6.00832C12.25 5.38332 12.9583 4.99998 13.7167 5.00831L17.5083 5.02499"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M15.834 16.65L17.5007 14.9833" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M7.40835 7.18332L6.50833 5.93332C6.08333 5.34166 5.39999 4.99166 4.67499 4.99999L2.5 5.00833"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M10.8086 12.8167L11.8253 14.125C12.2503 14.675 12.9169 15 13.6169 15L17.5086 14.9833"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M17.5007 5.01667L15.834 3.35001" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </NavIconFrame>
  );
}

export function BarChartIcon({ color }: IconProps) {
  return (
    <NavIconFrame>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.1103 11.15H7.4603C6.8303 11.15 6.32031 11.66 6.32031 12.29V17.41H10.1103V11.15V11.15Z"
          stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M12.7616 6.59998H11.2415C10.6115 6.59998 10.1016 7.10999 10.1016 7.73999V17.4H13.8916V7.73999C13.8916 7.10999 13.3916 6.59998 12.7616 6.59998Z"
          stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M16.5484 12.85H13.8984V17.4H17.6884V13.99C17.6784 13.36 17.1684 12.85 16.5484 12.85Z"
          stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </NavIconFrame>
  );
}

export function NewsIcon({ color }: IconProps) {
  return (
    <NavIconFrame>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M17.5 5.83335V14.1667C17.5 16.6667 16.25 18.3334 13.3333 18.3334H6.66667C3.75 18.3334 2.5 16.6667 2.5 14.1667V5.83335C2.5 3.33335 3.75 1.66669 6.66667 1.66669H13.3333C16.25 1.66669 17.5 3.33335 17.5 5.83335Z"
          stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M12.084 3.75V5.41667C12.084 6.33333 12.834 7.08333 13.7507 7.08333H15.4173"
          stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M6.66602 10.8333H9.99935" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.66602 14.1667H13.3327" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </NavIconFrame>
  );
}

export function AboutIcon({ color }: IconProps) {
  return (
    <NavIconFrame>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M9.99935 18.3334C14.5827 18.3334 18.3327 14.5834 18.3327 10C18.3327 5.41669 14.5827 1.66669 9.99935 1.66669C5.41602 1.66669 1.66602 5.41669 1.66602 10C1.66602 14.5834 5.41602 18.3334 9.99935 18.3334Z"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M10 6.66669V10.8334" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.99609 13.3333H10.0036" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </NavIconFrame>
  );
}

export function TimeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17.2923 11.0417C17.2923 15.0667 14.0257 18.3333 10.0007 18.3333C5.97565 18.3333 2.70898 15.0667 2.70898 11.0417C2.70898 7.01667 5.97565 3.75 10.0007 3.75C14.0257 3.75 17.2923 7.01667 17.2923 11.0417Z"
        stroke="#3C91E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M10 6.66675V10.8334" stroke="#3C91E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 1.66675H12.5" stroke="#3C91E6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TimerIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M12 8V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 2H15" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ color, className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 2V5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2V5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 9.09H20.5" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M15.6937 13.7H15.7027" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.6937 16.7H15.7027" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9945 13.7H12.0035" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9945 16.7H12.0035" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.29529 13.7H8.30427" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.29529 16.7H8.30427" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <g filter="url(#filter0_d_182_2563)">
        <path
          d="M16.0137 8.95317C11.5954 8.95317 8.01367 12.5352 8.01367 16.9532C8.01367 21.3712 11.5954 24.9532 16.0137 24.9532C17.8504 24.9532 19.5913 24.3222 20.9416 23.2822L25.2949 27.6722C25.6855 28.0622 26.3419 28.0622 26.7325 27.6722C27.123 27.2812 27.123 26.6252 26.7325 26.2342L22.349 21.8742C23.3898 20.5242 24.0137 18.7902 24.0137 16.9532C24.0137 12.5352 20.432 8.95317 16.0137 8.95317ZM16.0137 10.9532C19.3274 10.9532 22.0137 13.6392 22.0137 16.9532C22.0137 20.2672 19.3274 22.9532 16.0137 22.9532C12.7 22.9532 10.0137 20.2672 10.0137 16.9532C10.0137 13.6392 12.7 10.9532 16.0137 10.9532Z"
          fill="#E0E1EB"
        />
      </g>
      <defs>
        <filter id="filter0_d_182_2563" x="0.0136719" y="0.953165" width="35.0117" height="35.0115" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_182_2563" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_182_2563" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
