import Decimal from "decimal.js";
import { asString, money, roundMoney } from "./decimal";
import { getPaypalRule, PAYPAL_CONSUMER_SOURCE_US } from "./paypal-rules";
import type { FeeInput, FeeResult } from "./types";

function percentOf(amount: Decimal, percent: string) {
  return amount.mul(money(percent)).div(100);
}

function calculateForRequestedAmount(input: FeeInput, requestedAmount: Decimal, isReverse = false): FeeResult {
  const rule = getPaypalRule(input.accountCountry, input.transactionType);
  if (!rule) {
    const source = PAYPAL_CONSUMER_SOURCE_US;
    return {
      inputAmount: asString(requestedAmount, input.paymentCurrency),
      requestedAmount: asString(requestedAmount, input.paymentCurrency),
      totalFees: "0.00",
      netReceived: asString(requestedAmount, input.receivingCurrency),
      effectiveRate: "0.00",
      feeLines: [],
      isInternational: input.forceInternational || input.accountCountry !== input.otherCountry,
      hasCurrencyConversion: input.currencyConversion || input.paymentCurrency !== input.receivingCurrency,
      rateUsed: "No verified rate selected",
      formula: "No calculation shown because the selected payment type is not covered by a verified published rate.",
      assumptions: [
        `Recipient's country: ${input.accountCountry}`,
        `Sender's country: ${input.otherCountry}`,
        `Payment type: ${input.transactionType}`,
      ],
      source,
      warnings: [
        "Verified PayPal fee rules are currently implemented for selected commercial receiving account countries and payment types only. Select a supported commercial transaction type to calculate with published rates.",
      ],
    };
  }

  const isInternational = input.forceInternational || input.accountCountry !== input.otherCountry;
  if (!isInternational && rule.domesticUnsupported) {
    return {
      inputAmount: asString(money(input.amount), input.paymentCurrency),
      requestedAmount: asString(requestedAmount, input.paymentCurrency),
      totalFees: "0.00",
      netReceived: "0.00",
      effectiveRate: "0.00",
      feeLines: [],
      isInternational,
      hasCurrencyConversion: input.currencyConversion || input.paymentCurrency !== input.receivingCurrency,
      rateUsed: "No verified domestic rate selected",
      formula: "No calculation shown because this market only has a verified international receiving rule in the current rate table.",
      assumptions: [
        `Recipient's country: ${input.accountCountry}`,
        `Sender's country: ${input.otherCountry}`,
        "Domestic receiving estimate blocked",
      ],
      source: rule.source,
      warnings: [
        "This recipient country does not have a verified domestic PayPal receiving rate in the published fee schedule. Select an international sender country to calculate with published rates.",
      ],
    };
  }

  // A conversion spread only applies when the payment and receiving currencies differ.
  // A cross-border payment in the same currency still has international fees, but no FX spread.
  const hasCurrencyConversion = input.paymentCurrency !== input.receivingCurrency;
  const exchangeRate = hasCurrencyConversion ? money(input.exchangeRate ?? "0") : money(1);
  const missingExchangeRate = hasCurrencyConversion && !exchangeRate.gt(0);

  if (missingExchangeRate) {
    return {
      inputAmount: asString(money(input.amount), input.paymentCurrency),
      requestedAmount: asString(requestedAmount, input.paymentCurrency),
      totalFees: "0.00",
      netReceived: "0.00",
      effectiveRate: "0.00",
      feeLines: [],
      isInternational,
      hasCurrencyConversion,
      needsExchangeRate: true,
      rateUsed: "Exchange rate required",
      formula: "No cross-currency total is shown until an exchange rate is entered.",
      assumptions: [
        `Recipient's country: ${input.accountCountry}`,
        `Sender's country: ${input.otherCountry}`,
        `Payment currency: ${input.paymentCurrency}`,
        `Receiving currency: ${input.receivingCurrency}`,
      ],
      source: rule.source,
      warnings: [
        "Enter an estimated exchange rate to calculate cross-currency receiving amounts.",
        "Use a base or mid-market exchange rate here; if you enter PayPal's final displayed rate, turn off Currency conversion to avoid double-counting the spread.",
        "This is an independent estimate based on published PayPal fee information. Actual fees can vary by account type, funding source, merchant agreement, and transaction details.",
      ],
    };
  }

  const grossReceived = requestedAmount.mul(exchangeRate);
  const internationalPercent = isInternational
    ? (rule.internationalPercentOverrides?.[input.otherCountry] ?? rule.internationalPercent)
    : "0";
  const baseFee = percentOf(grossReceived, rule.domesticPercent);
  const internationalFee = isInternational ? percentOf(grossReceived, internationalPercent) : money(0);
  const appliesFixedFee = rule.appliesFixedFee ?? true;
  const fixedFee = appliesFixedFee ? money(rule.fixedFees[input.receivingCurrency] ?? "0") : money(0);
  const conversionCost = hasCurrencyConversion
    ? percentOf(grossReceived, rule.conversionSpreadPercent ?? "0")
    : money(0);
  const totalFees = roundMoney(baseFee.plus(internationalFee).plus(fixedFee).plus(conversionCost), input.receivingCurrency);
  const netReceived = roundMoney(grossReceived.minus(totalFees), input.receivingCurrency);
  const effectiveRate = grossReceived.gt(0) ? totalFees.div(grossReceived).mul(100) : money(0);
  const appliedPercent = money(rule.domesticPercent)
    .plus(internationalPercent)
    .plus(hasCurrencyConversion ? (rule.conversionSpreadPercent ?? "0") : "0");
  const fixedFeeText = appliesFixedFee && rule.fixedFees[input.receivingCurrency]
    ? ` + ${asString(fixedFee, input.receivingCurrency)} ${input.receivingCurrency}`
    : "";
  const rateUsed = `${appliedPercent.toDecimalPlaces(2).toFixed(2)}% total applied rate${fixedFeeText}`;
  const formula = isReverse
    ? `Amount to request = (target received + fixed fee) / (1 - percentage rate). Fees are then recalculated on the gross request amount.`
    : `Estimated fees = gross received amount x ${appliedPercent.toDecimalPlaces(2).toFixed(2)}%${fixedFeeText}. Net received = gross received amount - estimated fees.`;

  return {
    inputAmount: asString(money(input.amount), input.paymentCurrency),
    requestedAmount: asString(requestedAmount, input.paymentCurrency),
    totalFees: asString(totalFees, input.receivingCurrency),
    netReceived: asString(netReceived, input.receivingCurrency),
    effectiveRate: effectiveRate.toDecimalPlaces(2).toFixed(2),
    isInternational,
    hasCurrencyConversion,
    rateUsed,
    formula,
    assumptions: [
      `Recipient's country: ${input.accountCountry}`,
      `Sender's country: ${input.otherCountry}`,
      `Transaction type: ${input.transactionType}`,
      `Payment currency: ${input.paymentCurrency}`,
      `Receiving currency: ${input.receivingCurrency}`,
      hasCurrencyConversion ? `Exchange rate used: ${input.exchangeRate} ${input.receivingCurrency} per 1 ${input.paymentCurrency}` : "No exchange rate used",
      isInternational ? "International fee applied" : "Domestic transaction",
      hasCurrencyConversion ? `Currency conversion estimate included at ${rule.conversionSpreadPercent ?? "0"}%` : "No currency conversion estimate included",
    ],
    source: rule.source,
    warnings: [
      "This is an independent estimate based on published PayPal fee information. Actual fees can vary by account type, funding source, merchant agreement, and transaction details.",
      ...(hasCurrencyConversion
        ? ["Currency conversion is estimated from the published spread language. Use a base or mid-market exchange rate here; if you enter PayPal's final displayed rate, turn off Currency conversion to avoid double-counting the spread."]
        : []),
    ],
    feeLines: [
      {
        label: "Base processing fee",
        amount: asString(baseFee, input.receivingCurrency),
        description: `${rule.domesticPercent}% of gross received amount`,
      },
      {
        label: "International fee",
        amount: asString(internationalFee, input.receivingCurrency),
        description: isInternational ? `${internationalPercent}% international adjustment; published total international rate is ${money(rule.domesticPercent).plus(internationalPercent).toFixed(2)}%` : "Not applied",
      },
      {
        label: "Fixed fee",
        amount: asString(fixedFee, input.receivingCurrency),
        description: appliesFixedFee
          ? rule.fixedFees[input.receivingCurrency]
            ? `Fixed fee for ${input.receivingCurrency}`
            : "No verified fixed fee in selected currency"
          : "Not applied for this published payment type",
      },
      {
        label: "Estimated currency conversion cost",
        amount: asString(conversionCost, input.receivingCurrency),
        description: hasCurrencyConversion ? `${rule.conversionSpreadPercent}% estimated conversion spread` : "Not applied",
      },
    ],
  };
}

export function calculateFees(input: FeeInput): FeeResult {
  const amount = money(input.amount);
  if (input.mode === "target_receive") return reverseCalculate(input);
  return calculateForRequestedAmount(input, amount);
}

export function reverseCalculate(input: FeeInput): FeeResult {
  const target = money(input.amount);
  const exchangeRate = input.paymentCurrency !== input.receivingCurrency ? money(input.exchangeRate ?? "0") : money(1);
  if (!exchangeRate.gt(0)) return calculateForRequestedAmount({ ...input, mode: "receiving" }, target);

  const startingAmount = exchangeRate.gt(0) ? target.div(exchangeRate) : target;
  let low = startingAmount;
  let high = startingAmount.mul(1.3).plus(10);
  let result = calculateForRequestedAmount({ ...input, mode: "receiving" }, high, true);

  for (let i = 0; i < 80; i += 1) {
    const mid = low.plus(high).div(2);
    result = calculateForRequestedAmount({ ...input, mode: "receiving" }, mid, true);
    if (money(result.netReceived).lt(target)) low = mid;
    else high = mid;
  }

  const requested = roundMoney(high, input.paymentCurrency);
  return calculateForRequestedAmount({ ...input, mode: "receiving" }, requested, true);
}

