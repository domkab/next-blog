"use client";

import { useEffect } from "react";

export default function TrackingExclusion() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("noTrack") === "true") {
      document.cookie = "umami_ignore=true; path=/; max-age=31536000";
    }
  }, []);

  return null;
}
