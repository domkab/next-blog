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
    setShow(!hasCookie("cookie_consent"));
  }, []);

  if (!show) return null;
  return <CookieBanner />;
}