import type { CountryCode, FeeRule, TransactionType } from "./types";

export const PAYPAL_SOURCE_US = {
  label: "Official PayPal US merchant fee schedule",
  url: "https://www.paypal.com/us/business/paypal-business-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2026-07-15",
  notes:
    "US merchant fee schedule lists 3.49% + fixed fee for PayPal Checkout, PayPal Guest Checkout, Pay with Venmo, and all other commercial transactions; 2.99% for Send/Receive Money for Goods and Services; 2.99% + fixed fee for standard credit and debit card payments; and a 1.50% additional international commercial transaction fee.",
};

export const PAYPAL_CONSUMER_SOURCE_US = {
  label: "Official PayPal US consumer fee schedule",
  url: "https://www.paypal.com/us/webapps/mpp/paypal-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2025-04-21",
  notes:
    "US consumer and merchant fee schedules state PayPal transaction exchange rates may include a currency conversion spread. The receiving-side calculator uses the published 3.00% spread for all other currency conversions.",
};

export const PAYPAL_SOURCE_PH = {
  label: "Official PayPal Philippines merchant fee schedule",
  url: "https://images.payflowlink.glb.paypal.com/ph/business/paypal-business-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2026-05-28",
  notes:
    "Philippines merchant fee schedule lists 3.40% + fixed fee for standard domestic commercial transactions for all other markets, 5.39% + fixed fee for receiving international commercial transactions for all other markets, and 15.00 PHP as the PHP fixed fee. PayPal consumer currency-conversion tables list 3.00% for payments received into another currency for the Asia Pacific group that includes the Philippines.",
};

export const PAYPAL_SOURCE_CA = {
  label: "Official PayPal Canada merchant fee schedule",
  url: "https://pep.paypal.com/ca/business/paypal-business-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2026-07-15",
  notes:
    "Canada merchant fee schedule lists 2.90% + fixed fee for standard domestic commercial transactions, plus 0.80% for US senders or 1.00% for all other international senders.",
};

export const PAYPAL_SOURCE_GB = {
  label: "Official PayPal UK merchant fee schedule",
  url: "https://www.paypal.com/gb/business/paypal-business-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2026-01-22",
  notes:
    "UK merchant fee schedule lists 2.90% + fixed fee for all other domestic commercial transactions. The calculator applies the published 1.99% international commercial add-on for non-EEA sender countries currently available in the selector.",
};

export const PAYPAL_SOURCE_AU = {
  label: "Official PayPal Australia merchant fee schedule",
  url: "https://www.paypal.com/au/business/paypal-business-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2026-07-23",
  notes:
    "Australia merchant fee schedule lists 2.90% + fixed fee for standard domestic commercial transactions and a 1.00% additional percentage-based fee for international commercial transactions.",
};

export const PAYPAL_SOURCE_IN = {
  label: "Official PayPal India merchant fee schedule",
  url: "https://www.paypal.com/in/business/paypal-business-fees",
  lastVerified: "2026-08-08",
  effectiveDate: "2024-03-28",
  notes:
    "India merchant fee schedule states India users only support international payments and lists 4.40% + fixed fee for receiving international commercial transactions.",
};

const usCommercialFixedFees = {
  USD: "0.49",
  EUR: "0.39",
  GBP: "0.39",
  CAD: "0.59",
  AUD: "0.59",
  PHP: "25.00",
  JPY: "49",
  SGD: "0.69",
  TWD: "14.00",
};

const globalCommercialFixedFees = {
  USD: "0.30",
  EUR: "0.35",
  GBP: "0.20",
  CAD: "0.30",
  AUD: "0.30",
  PHP: "15.00",
  JPY: "40",
  SGD: "0.50",
  TWD: "10.00",
};

const ukCommercialFixedFees = {
  ...globalCommercialFixedFees,
  GBP: "0.30",
};

const indiaCommercialFixedFees = {
  ...globalCommercialFixedFees,
  INR: "3.00",
};

export const paypalRules: FeeRule[] = [
  {
    provider: "paypal",
    country: "US",
    transactionType: "goods_services",
    product: "send_receive_money_goods_services",
    domesticPercent: "2.99",
    internationalPercent: "1.50",
    appliesFixedFee: false,
    fixedFees: usCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_US,
  },
  {
    provider: "paypal",
    country: "US",
    transactionType: "invoice",
    product: "paypal_invoice_paypal_checkout",
    domesticPercent: "3.49",
    internationalPercent: "1.50",
    fixedFees: usCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_US,
  },
  {
    provider: "paypal",
    country: "US",
    transactionType: "commercial",
    product: "paypal_checkout",
    domesticPercent: "3.49",
    internationalPercent: "1.50",
    fixedFees: usCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_US,
  },
  {
    provider: "paypal",
    country: "US",
    transactionType: "merchant",
    product: "standard_credit_debit_cards",
    domesticPercent: "2.99",
    internationalPercent: "1.50",
    fixedFees: usCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_US,
  },
  ...(["goods_services", "invoice", "commercial", "merchant"] as TransactionType[]).map((transactionType) => ({
    provider: "paypal" as const,
    country: "PH" as const,
    transactionType,
    product: "commercial_transaction",
    domesticPercent: "3.40",
    internationalPercent: "1.99",
    fixedFees: globalCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_PH,
  })),
  ...(["goods_services", "invoice", "commercial", "merchant"] as TransactionType[]).map((transactionType) => ({
    provider: "paypal" as const,
    country: "CA" as const,
    transactionType,
    product: "commercial_transaction",
    domesticPercent: "2.90",
    internationalPercent: "1.00",
    internationalPercentOverrides: { US: "0.80" },
    fixedFees: globalCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_CA,
  })),
  ...(["goods_services", "invoice", "commercial", "merchant"] as TransactionType[]).map((transactionType) => ({
    provider: "paypal" as const,
    country: "GB" as const,
    transactionType,
    product: "all_other_commercial_transactions",
    domesticPercent: "2.90",
    internationalPercent: "1.99",
    fixedFees: ukCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_GB,
  })),
  ...(["goods_services", "invoice", "commercial", "merchant"] as TransactionType[]).map((transactionType) => ({
    provider: "paypal" as const,
    country: "AU" as const,
    transactionType,
    product: "commercial_transaction",
    domesticPercent: "2.90",
    internationalPercent: "1.00",
    fixedFees: globalCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_AU,
  })),
  ...(["goods_services", "invoice", "commercial", "merchant"] as TransactionType[]).map((transactionType) => ({
    provider: "paypal" as const,
    country: "IN" as const,
    transactionType,
    product: "international_commercial_transaction",
    domesticPercent: "0.00",
    internationalPercent: "4.40",
    domesticUnsupported: true,
    fixedFees: indiaCommercialFixedFees,
    conversionSpreadPercent: "3.00",
    source: PAYPAL_SOURCE_IN,
  })),
];

export const supportedPaypalCountries: CountryCode[] = ["US", "CA", "GB", "AU", "PH", "IN"];

export function getPaypalRule(country: CountryCode, transactionType: TransactionType) {
  return paypalRules.find((rule) => rule.country === country && rule.transactionType === transactionType);
}
