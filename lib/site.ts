export const siteUrl = "https://tryfeeclarity.com";

export const pages = [
  "/",
  "/paypal-international-fee-calculator/",
  "/paypal-reverse-fee-calculator/",
  "/paypal-currency-conversion-calculator/",
  "/paypal-fees/",
  "/how-to-calculate-paypal-fees/",
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
];

export const consolidatedRedirects: Record<string, string> = {
  "/paypal-fee-calculator/": "/",
  "/paypal-invoice-fee-calculator/": "/paypal-reverse-fee-calculator/",
  "/paypal-goods-and-services-fee-calculator/": "/",
  "/paypal-merchant-fee-calculator/": "/",
  "/paypal-international-fees/": "/paypal-international-fee-calculator/",
  "/how-much-does-paypal-charge/": "/paypal-fees/",
  "/paypal-currency-conversion-fees/": "/paypal-currency-conversion-calculator/",
  "/paypal-fees-for-freelancers/": "/paypal-reverse-fee-calculator/",
  "/paypal-fees-for-business/": "/paypal-fees/",
  "/paypal-fees-for-invoices/": "/paypal-reverse-fee-calculator/",
};

export function canonical(path: string) {
  return `${siteUrl}${path}`;
}
