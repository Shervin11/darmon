import type { CSSProperties } from "react";

/** DARMON heartbeat line used in page banners (viewBox 0 0 1200 120). */
export const ECG_WIDE =
  "M0 60 H300 L330 60 L350 22 L375 100 L395 60 H520 L545 60 L565 8 L595 112 L620 60 H900 L925 60 L940 34 L958 84 L972 60 H1200";

/** Short heartbeat for empty states and loaders (viewBox 0 0 120 40). */
export const ECG_SHORT = "M0 20 H34 L42 20 L48 5 L57 35 L64 20 H120";

/** Animation delay for the .fx-* classes in globals.css. */
export const delay = (s: string) => ({ "--d": s } as CSSProperties);

export const DefaultPhoto = "/logo1.png";
