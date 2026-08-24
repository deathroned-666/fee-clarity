import { describe, expect, it } from "vitest";
import { calculateFees } from "@/lib/fees/engine";

const baseInput = {
  amount: "1000",
  mode: "receiving" as const,
  accountCountry: "US" as const,
  otherCountry: "US" as const,
  transactionType: "commercial" as const,
  paymentCurrency: "USD" as const,
  receivingCurrency: "USD" as const,
};

describe("PayPal fee engine", () => {
  it("calculates US domestic commercial fees with decimal-safe rounding", () => {
    const result = calculateFees(baseInput);
    expect(result.totalFees).toBe("35.39");
    expect(result.netReceived).toBe("964.61");
    expect(result.effectiveRate).toBe("3.54");
  });

  it("separates international fee from base processing fee", () => {
    const result = calculateFees({ ...baseInput, otherCountry: "CA" });
    expect(result.isInternational).toBe(true);
    expect(result.feeLines.find((line) => line.label === "International fee")?.amount).toBe("15.00");
    expect(result.totalFees).toBe("50.39");
  });

  it("does not add a US fixed fee for Send/Receive Money for Goods and Services", () => {
    const result = calculateFees({ ...baseInput, transactionType: "goods_services" });
    expect(result.feeLines.find((line) => line.label === "Fixed fee")?.amount).toBe("0.00");
    expect(result.totalFees).toBe("29.90");
    expect(result.netReceived).toBe("970.10");
  });

  it("solves reverse requested amount for target net received", () => {
    const result = calculateFees({ ...baseInput, mode: "target_receive", amount: "1000" });
    expect(Number(result.requestedAmount)).toBeGreaterThan(1000);
    expect(Number(result.netReceived)).toBeGreaterThanOrEqual(999.99);
  });

  it("does not invent rates for unsupported payment types", () => {
    const result = calculateFees({ ...baseInput, transactionType: "personal" });
    expect(result.feeLines).toHaveLength(0);
    expect(result.warnings[0]).toContain("selected commercial receiving account countries");
  });

  it("calculates Philippines international commercial fees in receiving currency with exchange rate", () => {
    const result = calculateFees({
      ...baseInput,
      amount: "2100",
      accountCountry: "PH",
      otherCountry: "US",
      transactionType: "goods_services",
      paymentCurrency: "USD",
      receivingCurrency: "PHP",
      currencyConversion: true,
      exchangeRate: "56",
    });

    expect(result.totalFees).toBe("9881.64");
    expect(result.netReceived).toBe("107718.36");
    expect(result.effectiveRate).toBe("8.40");
  });

  it("does not add a currency-conversion spread when currencies match", () => {
    const result = calculateFees({
      ...baseInput,
      amount: "2100",
      accountCountry: "PH",
      otherCountry: "US",
      transactionType: "goods_services",
      paymentCurrency: "PHP",
      receivingCurrency: "PHP",
      currencyConversion: true,
      exchangeRate: "1",
    });

    expect(result.hasCurrencyConversion).toBe(false);
    expect(result.feeLines.find((line) => line.label === "Estimated currency conversion cost")?.amount).toBe("0.00");
    expect(result.totalFees).toBe("128.19");
    expect(result.netReceived).toBe("1971.81");
  });

  it.each([
    ["USD", "PHP", "56"],
    ["PHP", "USD", "0.0178571429"],
    ["EUR", "PHP", "60"],
    ["GBP", "INR", "110"],
    ["USD", "JPY", "150"],
    ["CAD", "AUD", "1.05"],
    ["TWD", "USD", "0.031"],
  ])("uses the supplied rate in the correct direction for %s to %s", (paymentCurrency, receivingCurrency, exchangeRate) => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "PH",
      otherCountry: "US",
      paymentCurrency: paymentCurrency as "USD",
      receivingCurrency: receivingCurrency as "USD",
      exchangeRate,
    });

    expect(result.needsExchangeRate).toBeUndefined();
    expect(Number(result.netReceived)).toBeGreaterThan(0);
    expect(result.assumptions).toContain(`Exchange rate used: ${exchangeRate} ${receivingCurrency} per 1 ${paymentCurrency}`);
  });

  it("requires an exchange rate before calculating cross-currency receiving amounts", () => {
    const result = calculateFees({
      ...baseInput,
      amount: "2500",
      accountCountry: "PH",
      otherCountry: "US",
      transactionType: "goods_services",
      paymentCurrency: "USD",
      receivingCurrency: "PHP",
      currencyConversion: true,
    });

    expect(result.needsExchangeRate).toBe(true);
    expect(result.feeLines).toHaveLength(0);
    expect(result.totalFees).toBe("0.00");
    expect(result.warnings[0]).toContain("exchange rate");
  });

  it("does not solve reverse cross-currency requests without an exchange rate", () => {
    const result = calculateFees({
      ...baseInput,
      mode: "target_receive",
      amount: "2500",
      accountCountry: "PH",
      otherCountry: "US",
      transactionType: "goods_services",
      paymentCurrency: "USD",
      receivingCurrency: "PHP",
      currencyConversion: true,
    });

    expect(result.needsExchangeRate).toBe(true);
    expect(result.requestedAmount).toBe("2500.00");
    expect(result.feeLines).toHaveLength(0);
  });

  it("calculates Canada commercial fees with the US sender international add-on", () => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "CA",
      otherCountry: "US",
      paymentCurrency: "CAD",
      receivingCurrency: "CAD",
    });

    expect(result.totalFees).toBe("37.30");
    expect(result.netReceived).toBe("962.70");
    expect(result.effectiveRate).toBe("3.73");
  });

  it("calculates Canada commercial fees with the non-US international add-on", () => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "CA",
      otherCountry: "AU",
      paymentCurrency: "CAD",
      receivingCurrency: "CAD",
    });

    expect(result.totalFees).toBe("39.30");
    expect(result.netReceived).toBe("960.70");
  });

  it("calculates UK all-other commercial fees for non-EEA sender countries", () => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "GB",
      otherCountry: "US",
      paymentCurrency: "GBP",
      receivingCurrency: "GBP",
    });

    expect(result.totalFees).toBe("49.20");
    expect(result.netReceived).toBe("950.80");
  });

  it("calculates Australia commercial fees", () => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "AU",
      otherCountry: "US",
      paymentCurrency: "AUD",
      receivingCurrency: "AUD",
    });

    expect(result.totalFees).toBe("39.30");
    expect(result.netReceived).toBe("960.70");
  });

  it("calculates India international commercial fees only", () => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "IN",
      otherCountry: "US",
      paymentCurrency: "INR",
      receivingCurrency: "INR",
    });

    expect(result.totalFees).toBe("47.00");
    expect(result.netReceived).toBe("953.00");
  });

  it("does not calculate unsupported India domestic receiving fees", () => {
    const result = calculateFees({
      ...baseInput,
      accountCountry: "IN",
      otherCountry: "IN",
      paymentCurrency: "INR",
      receivingCurrency: "INR",
    });

    expect(result.feeLines).toHaveLength(0);
    expect(result.warnings[0]).toContain("domestic PayPal receiving rate");
  });
});

