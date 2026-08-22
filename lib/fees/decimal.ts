import Decimal from "decimal.js";

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export function money(value: string | number | Decimal) {
  return new Decimal(value || 0);
}

export function roundMoney(value: Decimal, currency = "USD") {
  const zeroDecimal = new Set(["JPY"]);
  return value.toDecimalPlaces(zeroDecimal.has(currency) ? 0 : 2, Decimal.ROUND_HALF_UP);
}

export function asString(value: Decimal, currency = "USD") {
  return roundMoney(value, currency).toFixed(currency === "JPY" ? 0 : 2);
}
