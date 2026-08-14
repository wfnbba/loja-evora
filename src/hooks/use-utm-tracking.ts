import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "src",
  "sck",
];

export function useUtmTracking() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let hasUtms = false;

    const utms: Record<string, string> = {};

    UTM_PARAMS.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        utms[param] = value;
        hasUtms = true;
      }
    });

    if (hasUtms) {
      // Persist in sessionStorage to keep it for the session
      const existing = JSON.parse(sessionStorage.getItem("utmify_params") || "{}");
      sessionStorage.setItem(
        "utmify_params",
        JSON.stringify({ ...existing, ...utms })
      );
    }
  }, [location.search]);
}

export function getPersistedUtms() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("utmify_params") || "{}");
  } catch (e) {
    return {};
  }
}
