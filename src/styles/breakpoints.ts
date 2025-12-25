export const BREAKPOINTS = {
  mobileSMax: 389,
  mobileMax: 767,
  tabletMin: 767,
  tabletOnlyMax: 1023,
  laptopMin: 1023,
  laptopLMin: 1441,
  desktop2xlMin: 2500,
} as const;

export const MQ = {
  mobileS: `(max-width: ${BREAKPOINTS.mobileSMax}px)`,
  mobile: `(max-width: ${BREAKPOINTS.mobileMax}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tabletMin}px)`,
  tabletOnly: `(min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletOnlyMax}px)`,
  laptop: `(min-width: ${BREAKPOINTS.laptopMin}px)`,
  laptopL: `(min-width: ${BREAKPOINTS.laptopLMin}px)`,
  desktop2xl: `(min-width: ${BREAKPOINTS.desktop2xlMin}px)`,
} as const;