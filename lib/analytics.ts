type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("feeclarity:analytics", { detail: { name, payload } }));
  const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  dataLayer?.push({ event: name, ...payload });
}
