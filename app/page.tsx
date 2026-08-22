import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalculatorIcon, Globe2, ReceiptText, RefreshCw, Repeat2, ShieldCheck } from "lucide-react";
import { ExamplesTable, JsonLd, PageHero } from "@/components/SeoBlocks";
import { paypalRules } from "@/lib/fees/paypal-rules";
import { canonical, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "PayPal Fee Calculator",
  description: "Calculate PayPal transaction fees, international charges, currency conversion estimates, and the amount you will actually receive.",
  alternates: { canonical: canonical("/") },
};

const guideCards = [
  {
    title: "How much will PayPal take?",
    description: "PayPal fees depend on the payment amount, transaction type, country, currency, and whether the payment is domestic or international.",
    href: "/how-much-does-paypal-charge/",
    cta: "Calculate PayPal fees",
    icon: ReceiptText,
  },
  {
    title: "How much should I charge?",
    description: "Use the reverse calculator to find the amount you need to charge when you want to receive a specific amount after PayPal fees.",
    href: "/paypal-reverse-fee-calculator/",
    cta: "Calculate reverse fee",
    icon: Repeat2,
  },
  {
    title: "Domestic vs international fees",
    description: "International payments may include additional charges when sender and recipient PayPal accounts are registered in different markets.",
    href: "/paypal-international-fee-calculator/",
    cta: "Learn about international fees",
    icon: Globe2,
  },
  {
    title: "Currency conversion fees",
    description: "Currency conversion is separate from the processing fee and may include a spread in PayPal's exchange rate.",
    href: "/paypal-currency-conversion-fees/",
    cta: "Learn about conversion fees",
    icon: RefreshCw,
  },
];

const relatedToolCards = [
  {
    category: "Calculator",
    title: "Reverse PayPal Fee Calculator",
    description: "Calculate how much you need to charge to receive an exact amount after PayPal fees.",
    href: "/paypal-reverse-fee-calculator/",
    cta: "Calculate reverse fee",
    icon: Repeat2,
  },
  {
    category: "Calculator",
    title: "International PayPal Fee Calculator",
    description: "Estimate fees when the sender and recipient PayPal accounts are in different countries or markets.",
    href: "/paypal-international-fee-calculator/",
    cta: "Calculate international fee",
    icon: Globe2,
  },
  {
    category: "Calculator",
    title: "Currency Conversion Calculator",
    description: "Estimate the additional cost when PayPal converts one currency into another.",
    href: "/paypal-currency-conversion-calculator/",
    cta: "Calculate conversion",
    icon: CalculatorIcon,
  },
  {
    category: "Guide",
    title: "PayPal Fees Guide",
    description: "Understand processing rates, fixed fees, international charges, and common PayPal fee rules.",
    href: "/paypal-fees/",
    cta: "View PayPal fees",
    icon: ReceiptText,
  },
];

const audienceCards = [
  {
    title: "Freelancers and consultants",
    description: "Work backward from the amount you need to receive when preparing a client quote or invoice.",
    href: "/paypal-reverse-fee-calculator/",
    cta: "Plan an invoice",
    icon: Repeat2,
  },
  {
    title: "Online sellers",
    description: "See how processing and fixed fees may affect the amount left from a customer payment.",
    href: "/paypal-goods-and-services-fee-calculator/",
    cta: "Estimate a sale",
    icon: ReceiptText,
  },
  {
    title: "International businesses",
    description: "Separate domestic processing, international charges, and currency conversion when markets differ.",
    href: "/paypal-international-fee-calculator/",
    cta: "Check a cross-border payment",
    icon: Globe2,
  },
  {
    title: "Anyone checking a payment route",
    description: "Compare the amount sent with the amount received using visible assumptions and source details.",
    href: "/paypal-fee-calculator/",
    cta: "Open the calculator",
    icon: CalculatorIcon,
  },
];

const latestPaypalVerificationDate = paypalRules
  .map((rule) => rule.source.lastVerified)
  .sort()
  .at(-1);

const faqs = [
  {
    q: "How much does PayPal charge per transaction?",
    a: "PayPal fees vary by country, payment type, transaction type, and currency. FeeClarity uses PayPal's published fee schedules and shows the applicable rate and source with each calculation.",
  },
  {
    q: "How are PayPal fees calculated?",
    a: "Most PayPal transaction fees combine a percentage of the payment amount with a fixed fee. International transactions and currency conversion may add separate costs.",
  },
  {
    q: "How much does PayPal charge for $100?",
    a: "The fee depends on the sender and recipient countries, transaction type, currency, and payment method. Enter $100 in the FeeClarity calculator to see the applicable fee and assumptions.",
  },
  {
    q: "How much does PayPal charge for $1,000?",
    a: "The exact fee depends on the transaction configuration. Use the calculator with $1,000 entered to see the percentage fee, fixed fee, international charges, and estimated amount received.",
  },
  {
    q: "Does PayPal charge international fees?",
    a: "PayPal can apply additional percentage-based fees when sender and recipient accounts are registered in different markets. The applicable rate depends on the relevant PayPal fee schedule.",
  },
  {
    q: "Who pays PayPal fees, the sender or recipient?",
    a: "For many commercial transactions, the seller or recipient pays the processing fee. The exact cost can depend on the transaction type, funding method, region, and PayPal account terms.",
  },
  {
    q: "How much should I charge to cover PayPal fees?",
    a: "Use FeeClarity's reverse calculator. Enter the exact amount you want to receive and the calculator will estimate the gross payment required to cover the applicable fees.",
  },
  {
    q: "Does PayPal charge a currency conversion fee?",
    a: "When PayPal converts one currency into another, the exchange rate may include a conversion spread. FeeClarity separates estimated conversion costs from transaction processing fees whenever possible.",
  },
  {
    q: "Are PayPal fees different by country?",
    a: "Yes. PayPal maintains different fee schedules across markets and may also group countries into fee regions. FeeClarity uses country-specific rules when verified pricing information is available.",
  },
  {
    q: "Is FeeClarity affiliated with PayPal?",
    a: "No. FeeClarity is an independent fee calculation service and is not affiliated with, endorsed by, or sponsored by PayPal.",
  },
];

export default function Home() {
  return (
    <>
      <PageHero title="PayPal Fee Calculator" description="See exactly what PayPal may charge, what you'll receive, and how the estimate was calculated." />
      <HomeSupportContent />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "PayPal Fee Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "FeeClarity",
        url: siteUrl,
        description: "Independent payment-fee calculators and source-backed guides.",
        publisher: { "@id": `${siteUrl}/#organization` },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "FeeClarity",
        url: siteUrl,
        email: "contact@tryfeeclarity.com",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }} />
    </>
  );
}

function HomeSupportContent() {
  return (
    <main className="bg-white">
      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-[minmax(0,760px)_minmax(220px,1fr)]">
          <div className="grid gap-8">
            <div className="max-w-[760px]">
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">Understand your result</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-ink md:text-[32px]">How the PayPal Fee Calculator Works</h2>
              <p className="mt-5 text-base leading-7 text-muted">
                FeeClarity separates processing fees, fixed fees, international charges, and estimated currency conversion costs so you can see exactly how a payment is calculated.
              </p>
            </div>

            <div className="grid gap-4 rounded border border-line bg-white p-5 md:p-6">
              <h3 className="text-xl font-semibold text-ink">How to use the calculator</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["1", "Enter the payment details", "Add the amount, countries, transaction type, and currencies."],
                  ["2", "Choose the calculation", "Estimate what you receive, or solve backward for an exact target amount."],
                  ["3", "Review the estimate", "Check each fee line, assumption, source, and verification date."],
                ].map(([number, title, description]) => (
                  <div key={number} className="rounded border border-line bg-paper p-4">
                    <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-semibold text-white" aria-hidden="true">{number}</span>
                    <h4 className="mt-3 text-sm font-semibold text-ink">{title}</h4>
                    <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Percentage-based processing fee", "Fixed transaction fee", "International surcharge", "Estimated currency conversion cost"].map((item) => (
                  <div key={item} className="rounded border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-sm leading-6 text-muted">
                Every result also shows the rate used, official source, effective date, verification date, calculation formula, and assumptions.
              </p>
              <Link href="/methodology/" className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-mint">
                View calculation methodology <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded border border-line bg-white p-5 text-sm leading-6 text-muted lg:sticky lg:top-20">
            <p className="font-semibold text-ink">Transparency first</p>
            <p className="mt-2">FeeClarity uses source-linked rates and blocks unsupported estimates instead of borrowing another market's pricing.</p>
            <Link href="/rate-log/" className="mt-3 inline-flex items-center gap-1 font-semibold text-mint">
              View rate log <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20">
          <div className="max-w-[760px]">
            <h2 className="text-3xl font-bold leading-tight text-ink md:text-[32px]">How PayPal Fees Are Calculated</h2>
            <div className="mt-5 grid gap-4 text-base leading-7 text-muted">
              <p>Most PayPal commercial payments combine a percentage-based processing fee with a fixed fee based on the receiving currency.</p>
              <p>International transactions may include an additional percentage-based charge. Currency conversion can also add a separate cost when PayPal converts one currency into another.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)]">
            <div className="rounded border border-line bg-paper p-5 md:p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">PayPal Fee Formula</p>
              <div className="mt-4 grid gap-3 text-base leading-7 text-ink">
                <p className="font-semibold">PayPal Fee =</p>
                <p>Transaction Amount x Percentage Rate</p>
                <p>+ Fixed Fee</p>
                <p>+ International Fee, when applicable</p>
                <p>+ Currency Conversion Cost, when applicable</p>
                <p className="border-t border-line pt-3 font-semibold">= Estimated PayPal Fee</p>
              </div>
            </div>

            <div className="rounded border border-line bg-white p-5 text-sm leading-6 text-muted md:p-6">
              <p className="font-semibold text-ink">Example with stated assumptions</p>
              <dl className="mt-3 grid gap-2">
                <div className="flex justify-between gap-4"><dt>Payment amount</dt><dd className="font-medium text-ink">$1,000</dd></div>
                <div className="flex justify-between gap-4"><dt>Rate</dt><dd className="font-medium text-ink">3.49%</dd></div>
                <div className="flex justify-between gap-4"><dt>Fixed fee</dt><dd className="font-medium text-ink">$0.49</dd></div>
                <div className="flex justify-between gap-4"><dt>Percentage fee</dt><dd className="font-medium text-ink">$34.90</dd></div>
                <div className="flex justify-between gap-4 border-t border-line pt-2"><dt>Estimated total fee</dt><dd className="font-medium text-ink">$35.39</dd></div>
                <div className="flex justify-between gap-4"><dt>Estimated amount received</dt><dd className="font-medium text-mint">$964.61</dd></div>
              </dl>
              <p className="mt-4">Assumes a US recipient, US sender, commercial PayPal Checkout-style payment, USD, and no currency conversion. Rates vary by configuration.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20">
          <div className="max-w-[760px]">
            <h2 className="text-3xl font-bold leading-tight text-ink md:text-[32px]">Helpful PayPal Fee Guides</h2>
            <p className="mt-4 text-base leading-7 text-muted">Use these focused guides when you want to understand a specific fee scenario without reading the whole page.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {guideCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href} className="group rounded border border-line bg-white p-5 no-underline transition hover:border-mint focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky md:p-6">
                  <Icon size={22} className="text-mint" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold text-ink">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">
                    {card.cta} <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:items-start">
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Built for real payment decisions</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-ink md:text-[32px]">Who FeeClarity is for</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              FeeClarity helps people plan a payment before they send an invoice, accept a customer payment, or compare an international payment route.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {audienceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link key={card.href} href={card.href} className="group rounded border border-line bg-paper p-4 no-underline transition hover:border-mint focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky">
                    <Icon size={20} className="text-mint" aria-hidden="true" />
                    <h3 className="mt-3 text-base font-semibold text-ink">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mint">
                      {card.cta} <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <aside className="rounded-lg border border-line bg-paper p-5 md:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Why it is different</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">The estimate explains itself</h3>
            <p className="mt-3 text-base leading-7 text-muted">
              FeeClarity separates the fee lines, links to published sources, shows verification dates, and identifies unsupported configurations instead of filling gaps with another market's pricing.
            </p>
            <Link href="/about/" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">
              Learn how FeeClarity is maintained <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20">
          <div className="max-w-[760px]">
            <h2 className="text-3xl font-bold leading-tight text-ink md:text-[32px]">PayPal Fee Examples</h2>
            <p className="mt-4 text-base leading-7 text-muted">These examples point back to the calculator because the real fee changes by country, transaction type, currency, and conversion settings.</p>
          </div>
          <ExamplesTable />
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-[900px] px-4 py-14 md:py-20">
          <h2 className="text-3xl font-bold leading-tight text-ink md:text-[32px]">Frequently Asked Questions</h2>
          <p className="mt-4 text-base leading-7 text-muted">Common questions about PayPal fees and how FeeClarity calculates them.</p>
          <div className="mt-8 divide-y divide-line rounded border border-line bg-white">
            {faqs.map((faq, index) => (
              <details key={faq.q} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-5 text-left text-base font-semibold text-ink marker:hidden md:px-5">
                  <span className="text-base font-semibold md:text-lg">{faq.q}</span>
                  <span className="grid size-7 shrink-0 place-items-center rounded border border-line text-mint" aria-hidden="true">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:block">-</span>
                  </span>
                </summary>
                <div id={`faq-${index}`} className="px-4 pb-5 text-base leading-7 text-muted md:px-5">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-[760px]">
            <h2 className="text-3xl font-bold leading-tight text-ink md:text-[32px]">Related calculators and tools</h2>
            <p className="mt-3 text-base leading-7 text-muted">Need a more specific calculation? Choose the tool that matches your payment.</p>
          </div>

          <nav aria-label="Related calculators and tools" className="mt-8 grid gap-4 md:grid-cols-2">
            {relatedToolCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href} className="group rounded-lg border border-line bg-white p-5 no-underline transition hover:border-mint hover:bg-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky md:p-6">
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded border border-line bg-paper text-mint" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-mint">{card.category}</p>
                      <h3 className="mt-2 text-xl font-semibold leading-snug text-ink">{card.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted md:text-base md:leading-7">{card.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">
                        {card.cta} <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-lg border border-line bg-paper p-5 md:mt-12 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded border border-line bg-white text-mint" aria-hidden="true">
                  <ShieldCheck size={20} />
                </span>
                <div className="max-w-[780px]">
                  <h2 className="text-xl font-semibold text-ink">Independent fee calculations</h2>
                  <p className="mt-3 text-sm leading-6 text-muted md:text-base md:leading-7">
                    FeeClarity is independent and is not affiliated with PayPal. Calculations are estimates based on published fee schedules and may vary by account, country, transaction type, payment method, currency conversion, or merchant agreement.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">PayPal is a trademark of its respective owner.</p>
                  {latestPaypalVerificationDate ? (
                    <p className="mt-2 text-sm font-medium text-ink">PayPal rates last verified: {latestPaypalVerificationDate}</p>
                  ) : null}
                </div>
              </div>
              <nav aria-label="Rate transparency" className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint md:justify-end">
                <Link href="/methodology/" className="inline-flex items-center gap-1">
                  View methodology <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link href="/rate-log/" className="inline-flex items-center gap-1">
                  View rate log <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
