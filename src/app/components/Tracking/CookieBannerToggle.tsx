"use client";

import { useState } from "react";

import CookieBanner from "./CookieBanner";

export default function CookieBannerToggle({
  initialShow,
}: {
  initialShow: boolean;
}) {
  const [show, setShow] = useState(initialShow);
  if (!show) return null;

  return <CookieBanner onClose={() => setShow(false)} />;
}
