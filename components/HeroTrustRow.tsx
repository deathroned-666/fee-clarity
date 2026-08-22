import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { paypalRules } from "@/lib/fees/paypal-rules";

export function getLatestPaypalVerificationDate() {
  return paypalRules
    .map((rule) => rule.source.lastVerified)
    .sort()
    .at(-1);
}

export function formatVerificationDate(date?: string) {
  return date
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
    : null;
}

export function HeroTrustRow({
  signals,
  ariaLabel = "Page trust signals",
}: {
  signals?: string[];
  ariaLabel?: string;
}) {
  const verified = formatVerificationDate(getLatestPaypalVerificationDate());
  const trustSignals = signals ?? [
    verified ? `Rates verified ${verified}` : "Source-linked rate data",
    "Published PayPal fee sources",
    "Independent and not affiliated with PayPal",
    "No payment details collected",
    "Calculator runs in your browser",
  ];

  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted" aria-label={ariaLabel}>
        {trustSignals.map((signal) => (
          <li key={signal} className="inline-flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-mint" aria-hidden="true" />
            <span>{signal}</span>
          </li>
        ))}
      </ul>
      <nav aria-label="Rate transparency" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint">
        <Link href="/methodology/" className="inline-flex items-center gap-1">
          View methodology <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link href="/rate-log/" className="inline-flex items-center gap-1">
          View rate log <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </nav>
    </>
  );
}
