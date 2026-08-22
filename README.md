# FeeClarity

Independent payment-fee utility website centered on a PayPal Fee Calculator.

## Scope

- Next.js, TypeScript, React, Tailwind
- Provider-neutral fee rule architecture
- Decimal-safe PayPal calculator, reverse calculator, and international fee breakdown
- Source-tracked PayPal fee data
- SEO routes, canonical metadata, JSON-LD, sitemap, robots
- AdSense and analytics integrations
- Tests and content audit

## Fee data

PayPal rates are stored in `lib/fees/paypal-rules.ts`, separate from the calculation engine. The implemented calculator uses verified PayPal merchant fee information and warns instead of estimating unsupported markets.
