"use client";

import { useEffect, useState } from "react";
import CookieBanner from "./CookieBanner";

const hasCookie = (name: string) => {
  return document.cookie
    .split("; ")
    .some(cookie => cookie.startsWith(`${name}=`));
};

export default function CookieBannerToggle() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasConsent = hasCookie("cookie_consent");
    const needsBanner = hasCookie("needs_banner");
    setShow(needsBanner && !hasConsent);
  }, []);

  if (!show) return null;
  return <CookieBanner />;
}