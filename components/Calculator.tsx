"use client";

import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CalculationResult } from "@/components/CalculationResult";
import { trackEvent } from "@/lib/analytics";
import { calculateFees } from "@/lib/fees/engine";
import type { CalculatorMode, CountryCode, CurrencyCode, TransactionType } from "@/lib/fees/types";

const countries: { code: CountryCode; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "PH", label: "Philippines" },
  { code: "IN", label: "India" },
];

const currencies: CurrencyCode[] = ["USD", "EUR", "GBP", "CAD", "AUD", "PHP", "INR", "JPY", "SGD", "TWD"];

const transactionTypes: { value: TransactionType; label: string }[] = [
  { value: "goods_services", label: "Goods & Services" },
  { value: "invoice", label: "Invoice" },
  { value: "commercial", label: "Commercial payment" },
  { value: "merchant", label: "Merchant card payment" },
];

type ExchangeRateState =
  | { status: "idle"; message: string }
  | { status: "loading"; message: string }
  | { status: "success"; message: string; date: string }
  | { status: "error"; message: string };

function formatCurrency(value: string, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value || 0));
}

function formatExchangeRate(rate: number) {
  return Number(rate.toPrecision(8)).toString();
}

export function Calculator({ defaultMode = "receiving", compact = false }: { defaultMode?: CalculatorMode; compact?: boolean }) {
  const [amount, setAmount] = useState(defaultMode === "target_receive" ? "1000" : "250");
  const [mode, setMode] = useState<CalculatorMode>(defaultMode);
  const [accountCountry, setAccountCountry] = useState<CountryCode>("US");
  const [otherCountry, setOtherCountry] = useState<CountryCode>("US");
  const [transactionType, setTransactionType] = useState<TransactionType>("commercial");
  const [paymentCurrency, setPaymentCurrency] = useState<CurrencyCode>("USD");
  const [receivingCurrency, setReceivingCurrency] = useState<CurrencyCode>("USD");
  const [advanced, setAdvanced] = useState(false);
  const [forceInternational, setForceInternational] = useState(false);
  const [currencyConversion, setCurrencyConversion] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");
  const [exchangeRateManuallyEdited, setExchangeRateManuallyEdited] = useState(false);
  const [exchangeRateRefreshKey, setExchangeRateRefreshKey] = useState(0);
  const [exchangeRateState, setExchangeRateState] = useState<ExchangeRateState>({
    status: "idle",
    message: "Latest daily market rate will load when currencies differ.",
  });
  const hasCurrencyConversion = currencyConversion || paymentCurrency !== receivingCurrency;

  useEffect(() => {
    setExchangeRate("");
    setExchangeRateManuallyEdited(false);
    if (paymentCurrency === receivingCurrency) setCurrencyConversion(false);
  }, [paymentCurrency, receivingCurrency]);

  useEffect(() => {
    if (!hasCurrencyConversion) {
      setExchangeRateState({ status: "idle", message: "No exchange rate needed when currencies match." });
      return;
    }

    if (exchangeRateManuallyEdited) {
      setExchangeRateState({
        status: "idle",
        message: "Manual rate in use. Use PayPal's displayed rate only with Currency conversion turned off.",
      });
      return;
    }

    if (paymentCurrency === receivingCurrency) {
      setExchangeRate("1");
      setExchangeRateState({ status: "success", message: "Same-currency conversion baseline set to 1.", date: new Date().toISOString().slice(0, 10) });
      return;
    }

    const controller = new AbortController();
    setExchangeRateState({ status: "loading", message: `Loading latest ${paymentCurrency} to ${receivingCurrency} market rate...` });

    fetch(`https://api.frankfurter.dev/v2/rate/${paymentCurrency}/${receivingCurrency}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Rate unavailable");
        return response.json() as Promise<{ date?: string; rate?: number }>;
      })
      .then((data) => {
        if (typeof data.rate !== "number" || !Number.isFinite(data.rate) || data.rate <= 0) throw new Error("Rate unavailable");
        setExchangeRate(formatExchangeRate(data.rate));
        setExchangeRateState({
          status: "success",
          date: data.date ?? new Date().toISOString().slice(0, 10),
          message: `Latest market rate from Frankfurter, dated ${data.date ?? "today"}.`,
        });
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setExchangeRate("");
        setExchangeRateState({
          status: "error",
          message: "Latest rate could not load. Enter a market rate manually.",
        });
      });

    return () => controller.abort();
  }, [paymentCurrency, receivingCurrency, hasCurrencyConversion, exchangeRateManuallyEdited, exchangeRateRefreshKey]);

  const result = useMemo(
    () =>
      calculateFees({
        amount,
        mode,
        accountCountry,
        otherCountry,
        transactionType,
        paymentCurrency,
        receivingCurrency,
        forceInternational,
        currencyConversion,
        exchangeRate,
      }),
    [amount, mode, accountCountry, otherCountry, transactionType, paymentCurrency, receivingCurrency, forceInternational, currencyConversion, exchangeRate],
  );

  function copyAmount() {
    navigator.clipboard?.writeText(mode === "target_receive" ? result.requestedAmount : result.netReceived);
    trackEvent("calculator_copy_amount", { mode, transactionType });
  }

  function shareCalculation() {
    const text = `Estimated PayPal fees: ${formatCurrency(result.totalFees, receivingCurrency)}. Net received: ${formatCurrency(result.netReceived, receivingCurrency)}. Rate used: ${result.rateUsed}.`;
    if (navigator.share) navigator.share({ title: "PayPal fee estimate", text });
    else navigator.clipboard?.writeText(text);
    trackEvent("calculator_share", { mode, transactionType });
  }

  function reset() {
    setAmount("250");
    setMode("receiving");
    setAccountCountry("US");
    setOtherCountry("US");
    setTransactionType("commercial");
    setPaymentCurrency("USD");
    setReceivingCurrency("USD");
    setForceInternational(false);
    setCurrencyConversion(false);
    setExchangeRate("");
    setExchangeRateManuallyEdited(false);
    setExchangeRateState({ status: "idle", message: "Latest daily market rate will load when currencies differ." });
    trackEvent("calculator_reset");
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]" aria-label="PayPal fee calculator">
      <div className="rounded border border-line bg-white p-4 shadow-soft md:p-6">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Amount
            <input
              className="h-12 rounded border border-line px-3 text-lg"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              onBlur={() => trackEvent("calculator_amount_changed", { mode })}
              aria-describedby="amount-help"
            />
            <span id="amount-help" className="text-xs font-normal text-muted">
              {mode === "target_receive" ? "Enter the exact amount you want to receive after estimated PayPal fees." : "Enter the gross payment amount before estimated PayPal fees."}
            </span>
          </label>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Mode</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ["receiving", "What I'll receive"],
                ["target_receive", "What I should charge"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setMode(value as CalculatorMode)}
                  className={`rounded border px-3 py-2 text-sm ${mode === value ? "border-mint bg-mint text-white" : "border-line bg-paper text-ink"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Sender's country" helper="Country of the sender's PayPal account." value={otherCountry} onChange={(value) => setOtherCountry(value as CountryCode)} options={countries.map((c) => [c.code, c.label])} />
            <Select label="Recipient's country" helper="Country of the recipient's PayPal account." value={accountCountry} onChange={(value) => setAccountCountry(value as CountryCode)} options={countries.map((c) => [c.code, c.label])} />
            <Select label="Transaction type" value={transactionType} onChange={(value) => setTransactionType(value as TransactionType)} options={transactionTypes.map((t) => [t.value, t.label])} />
            <Select label="Payment currency" helper="Currency the payment amount is entered in; sender country does not set the currency." value={paymentCurrency} onChange={(value) => setPaymentCurrency(value as CurrencyCode)} options={currencies.map((c) => [c, c])} />
          </div>
          <button type="button" onClick={() => setAdvanced(!advanced)} className="w-fit rounded border border-line px-3 py-2 text-sm font-medium">
            Advanced options
          </button>
          {hasCurrencyConversion && (
            <div className="grid gap-2 rounded border border-amber-200 bg-amber-50 p-3 text-sm">
              <label className="grid gap-2 font-medium">
                Estimated exchange rate
                <input
                  className="h-11 rounded border border-line bg-white px-3"
                  inputMode="decimal"
                  placeholder={`1 ${paymentCurrency} = ? ${receivingCurrency}`}
                  value={exchangeRate}
                  onChange={(event) => {
                    setExchangeRate(event.target.value);
                    setExchangeRateManuallyEdited(true);
                  }}
                  aria-describedby="exchange-rate-help exchange-rate-source"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span id="exchange-rate-source" className={`text-xs ${exchangeRateState.status === "error" ? "text-red-700" : "text-muted"}`}>
                  {exchangeRateState.message}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setExchangeRateManuallyEdited(false);
                    setExchangeRateRefreshKey((value) => value + 1);
                    trackEvent("calculator_exchange_rate_refresh", { paymentCurrency, receivingCurrency });
                  }}
                  className="inline-flex items-center gap-1 rounded border border-line bg-white px-2 py-1 text-xs font-medium text-ink"
                >
                  <RefreshCcw size={13} /> Use latest rate
                </button>
              </div>
              <span id="exchange-rate-help" className="text-xs text-muted">
                FeeClarity auto-fills a latest daily market reference rate when available. PayPal's displayed rate may differ; if you enter PayPal's final rate, turn off Currency conversion to avoid double-counting the spread.
              </span>
            </div>
          )}
          {advanced && (
            <fieldset className="grid gap-3 rounded bg-paper p-4 text-sm sm:grid-cols-2">
              <legend className="sr-only">Optional fee assumptions</legend>
              <div className="sm:col-span-2">
                <Select label="Receiving currency" value={receivingCurrency} onChange={(value) => setReceivingCurrency(value as CurrencyCode)} options={currencies.map((c) => [c, c])} />
              </div>
              <label className="flex items-start gap-2 rounded border border-line bg-white p-3">
                <input className="mt-1" type="checkbox" checked={forceInternational} onChange={(event) => setForceInternational(event.target.checked)} />
                <span className="grid gap-1">
                  <span>Apply international fee override</span>
                  <span className="text-xs font-normal leading-5 text-muted">Auto-applies when countries differ. Use this for a cross-border payment when both selections match.</span>
                </span>
              </label>
              <label className="flex items-start gap-2 rounded border border-line bg-white p-3">
                <input className="mt-1" type="checkbox" checked={currencyConversion} disabled={paymentCurrency === receivingCurrency} onChange={(event) => setCurrencyConversion(event.target.checked)} />
                <span className="grid gap-1">
                  <span>Include estimated conversion spread</span>
                  <span className="text-xs font-normal leading-5 text-muted">{paymentCurrency === receivingCurrency ? "Unavailable because payment and receiving currencies match." : "Auto-applies when currencies differ. Adds an estimate, not PayPal's final exchange rate."}</span>
                </span>
              </label>
              <p className="border-t border-line pt-3 text-xs leading-5 text-muted sm:col-span-2">These options adjust the estimate only. Confirm the final fee and exchange rate inside PayPal before relying on the result.</p>
            </fieldset>
          )}
        </div>
      </div>
      <CalculationResult
        result={result}
        mode={mode}
        paymentCurrency={paymentCurrency}
        receivingCurrency={receivingCurrency}
        compact={compact}
        onCopy={copyAmount}
        onShare={shareCalculation}
        onReset={reset}
      />
    </section>
  );
}

function Select({ label, helper, value, onChange, options }: { label: string; helper?: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select className="h-11 rounded border border-line bg-white px-3" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
      {helper && <span className="text-xs font-normal text-muted">{helper}</span>}
    </label>
  );
}

