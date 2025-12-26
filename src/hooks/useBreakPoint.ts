import { useMediaQuery } from "./useMediaQuery";
import { MQ } from "@/styles/breakpoints";

export const useIsMobileS = () => useMediaQuery(MQ.mobileS);
export const useIsMobile = () => useMediaQuery(MQ.mobile);
export const useIsTablet = () => useMediaQuery(MQ.tablet);
export const useIsTabletOnly = () => useMediaQuery(MQ.tabletOnly);
export const useIsLaptop = () => useMediaQuery(MQ.laptop);
export const useIsLaptopL = () => useMediaQuery(MQ.laptopL);
export const useIsDesktop2xl = () => useMediaQuery(MQ.desktop2xl);