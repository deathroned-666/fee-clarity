export type ProviderId = "paypal";
export type TransactionType =
  | "goods_services"
  | "invoice"
  | "commercial"
  | "merchant"
  | "personal";

export type CalculatorMode = "receiving" | "sending" | "target_receive";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "PHP"
  | "INR"
  | "JPY"
  | "SGD"
  | "TWD";

export type CountryCode = "US" | "CA" | "GB" | "AU" | "PH" | "IN";

export type FeeSource = {
  label: string;
  url: string;
  lastVerified: string;
  effectiveDate: string;
  notes: string;
};

export type FeeRule = {
  provider: ProviderId;
  country: CountryCode;
  transactionType: TransactionType;
  product: string;
  domesticPercent: string;
  internationalPercent: string;
  internationalPercentOverrides?: Partial<Record<CountryCode, string>>;
  domesticUnsupported?: boolean;
  appliesFixedFee?: boolean;
  fixedFees: Partial<Record<CurrencyCode, string>>;
  conversionSpreadPercent?: string;
  source: FeeSource;
};

export type FeeInput = {
  amount: string;
  mode: CalculatorMode;
  accountCountry: CountryCode;
  otherCountry: CountryCode;
  transactionType: TransactionType;
  paymentCurrency: CurrencyCode;
  receivingCurrency: CurrencyCode;
  forceInternational?: boolean;
  currencyConversion?: boolean;
  exchangeRate?: string;
};

export type FeeLine = {
  label: string;
  amount: string;
  description: string;
};

export type FeeResult = {
  inputAmount: string;
  requestedAmount: string;
  totalFees: string;
  netReceived: string;
  effectiveRate: string;
  feeLines: FeeLine[];
  isInternational: boolean;
  hasCurrencyConversion: boolean;
  needsExchangeRate?: boolean;
  rateUsed: string;
  formula: string;
  assumptions: string[];
  source: FeeSource;
  warnings: string[];
};
