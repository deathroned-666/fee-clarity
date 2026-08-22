import { CheckCircle2, Copy, ExternalLink, RefreshCcw, Share2 } from "lucide-react";
import type { CalculatorMode, CurrencyCode, FeeResult } from "@/lib/fees/types";

function formatCurrency(value: string, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value || 0));
}

export function CalculationResult({
  result,
  mode,
  paymentCurrency,
  receivingCurrency,
  compact,
  onCopy,
  onShare,
  onReset,
}: {
  result: FeeResult;
  mode: CalculatorMode;
  paymentCurrency: CurrencyCode;
  receivingCurrency: CurrencyCode;
  compact?: boolean;
  onCopy: () => void;
  onShare: () => void;
  onReset: () => void;
}) {
  const primaryCurrency = mode === "target_receive" ? paymentCurrency : receivingCurrency;
  const primaryValue = mode === "target_receive" ? result.requestedAmount : result.netReceived;
  const primaryLabel = mode === "target_receive" ? "You should charge" : "You'll receive";

  return (
    <div className="rounded border border-line bg-ink p-4 text-white shadow-soft md:p-6">
      <p className="text-sm uppercase tracking-wide text-white/70">Estimate</p>
      <div className="mt-3 grid gap-3">
        {result.needsExchangeRate ? (
          <div className="rounded border border-amber-300/40 bg-amber-300/12 p-3 text-sm leading-6 text-amber-50">
            Enter an exchange rate to estimate {receivingCurrency} received from {paymentCurrency}. Cross-currency totals are hidden until a rate is provided.
          </div>
        ) : (
          <>
            <Metric label={primaryLabel} value={formatCurrency(primaryValue, primaryCurrency)} strong accent />
            <Metric label="Estimated PayPal fee" value={formatCurrency(result.totalFees, receivingCurrency)} />
            <p className="text-sm text-white/70">Effective fee rate: {result.effectiveRate}%</p>
            <FeeBreakdown result={result} currency={receivingCurrency} />
          </>
        )}
        <SourceVerification result={result} />
        <WhyThisRate result={result} />
        <CalculationAssumptions result={result} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCopy} className="inline-flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-medium text-ink">
            <Copy size={16} /> {mode === "target_receive" ? "Copy charge amount" : "Copy amount"}
          </button>
          <button type="button" onClick={onShare} className="inline-flex items-center gap-2 rounded border border-white/25 px-3 py-2 text-sm">
            <Share2 size={16} /> Share
          </button>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded border border-white/25 px-3 py-2 text-sm">
            <RefreshCcw size={16} /> Reset
          </button>
        </div>
      </div>
      {!compact && (
        <div className="mt-4 border-t border-white/15 pt-4 text-xs leading-5 text-white/70">
          <p>Rates last verified: {result.source.lastVerified}. Fee source: <a className="underline" href={result.source.url}>{result.source.label}</a>.</p>
          {result.warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      )}
    </div>
  );
}

export function FeeBreakdown({ result, currency }: { result: FeeResult; currency: CurrencyCode }) {
  return (
    <div className="grid gap-2 rounded bg-white/8 p-3" aria-label="Fee breakdown">
      {result.feeLines.map((line) => (
        <div key={line.label} className="flex items-start justify-between gap-4 text-sm">
          <span>
            <span className="block text-white">{line.label}</span>
            <span className="text-xs text-white/60">{line.description}</span>
          </span>
          <strong>{formatCurrency(line.amount, currency)}</strong>
        </div>
      ))}
    </div>
  );
}

export function SourceVerification({ result }: { result: FeeResult }) {
  return (
    <div className="grid gap-2 rounded border border-white/15 bg-white/6 p-3 text-xs leading-5 text-white/75">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1 font-medium text-emerald-100"><CheckCircle2 size={14} aria-hidden="true" /> Rates verified {result.source.lastVerified}</span>
        <a className="inline-flex items-center gap-1 underline" href={result.source.url}>Official source <ExternalLink size={13} aria-hidden="true" /></a>
      </div>
      <p>Rate used: {result.rateUsed}</p>
      <p>Effective date: {result.source.effectiveDate}</p>
    </div>
  );
}

export function WhyThisRate({ result }: { result: FeeResult }) {
  return (
    <details className="rounded border border-white/15 bg-white/6 p-3 text-sm">
      <summary className="cursor-pointer font-medium text-white">Why this rate?</summary>
      <p className="mt-3 text-white/72">{result.isInternational ? "This transaction is classified as international because the sender and recipient PayPal accounts are registered in different markets, or the international option was selected." : "This transaction is classified as domestic because the sender and recipient PayPal accounts are in the same market and no international override is selected."}</p>
      <p className="mt-2 text-white/72">The selected transaction type and recipient country determine the published PayPal fee schedule used for this estimate.</p>
    </details>
  );
}

export function CalculationAssumptions({ result }: { result: FeeResult }) {
  return (
    <details className="rounded border border-white/15 bg-white/6 p-3 text-sm">
      <summary className="cursor-pointer font-medium text-white">How this was calculated</summary>
      <div className="mt-3 grid gap-3 text-white/72">
        <p>{result.formula}</p>
        <div>
          <p className="font-medium text-white">Calculation assumptions</p>
          <ul className="mt-2 grid gap-1">
            {result.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
          </ul>
        </div>
      </div>
    </details>
  );
}

function Metric({ label, value, strong = false, accent = false }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${strong ? "border-t border-white/15 pt-3" : ""}`}>
      <span className="text-sm uppercase tracking-wide text-white/65">{label}</span>
      <strong className={`${strong ? "text-2xl" : "text-lg"} ${accent ? "text-emerald-200" : "text-white"}`}>{value}</strong>
    </div>
  );
}
