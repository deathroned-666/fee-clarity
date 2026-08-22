export const siteUrl = "https://tryfeeclarity.com";

export const pages = [
  "/",
  "/paypal-fee-calculator/",
  "/paypal-international-fee-calculator/",
  "/paypal-reverse-fee-calculator/",
  "/paypal-currency-conversion-calculator/",
  "/paypal-invoice-fee-calculator/",
  "/paypal-goods-and-services-fee-calculator/",
  "/paypal-merchant-fee-calculator/",
  "/paypal-fees/",
  "/paypal-international-fees/",
  "/how-much-does-paypal-charge/",
  "/how-to-calculate-paypal-fees/",
  "/paypal-currency-conversion-fees/",
  "/paypal-fees-for-freelancers/",
  "/paypal-fees-for-business/",
  "/paypal-fees-for-invoices/",
  "/paypal-fees/us/",
  "/paypal-fees/canada/",
  "/paypal-fees/uk/",
  "/paypal-fees/australia/",
  "/paypal-fees/philippines/",
  "/paypal-fees/india/",
  "/paypal-vs-wise/",
  "/paypal-vs-stripe/",
  "/paypal-vs-payoneer/",
  "/methodology/",
  "/rate-log/",
  "/editorial-policy/",
  "/advertising-policy/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
  "/sitemap/",
];

export function canonical(path: string) {
  return `${siteUrl}${path}`;
}
