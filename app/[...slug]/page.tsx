import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { FeeComponentGrid, FormulaCard, ImportantNote, OnThisPage, PageInfoCard, SectionHeading, SourceTransparencyCard, StepList, TrustStrip } from "@/components/ContentBlocks";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { HeroTrustRow } from "@/components/HeroTrustRow";
import { RelatedTools } from "@/components/RelatedTools";
import { Disclaimer, JsonLd, SeoArticle } from "@/components/SeoBlocks";
import { getPage, contentPages } from "@/lib/content";
import { calculateFees } from "@/lib/fees/engine";
import { PAYPAL_CONSUMER_SOURCE_US, PAYPAL_SOURCE_US, paypalRules } from "@/lib/fees/paypal-rules";
import { canonical, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string[] }> };

function pathFromSlug(slug: string[]) {
  return `/${slug.join("/")}/`;
}

const paypalVerificationDate = paypalRules
  .map((rule) => rule.source.lastVerified)
  .sort()
  .at(-1);

const formattedPaypalVerificationDate = paypalVerificationDate
  ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${paypalVerificationDate}T00:00:00Z`))
  : null;

const comparisonRows = [
  ["Best for", "Online payments and checkout", "International transfers and multi-currency payments"],
  ["Fee structure", "Percentage-based and fixed fees depending on transaction type", "Transfer and conversion fees vary by route and currency"],
  ["Exchange rate", "Currency conversion may include a spread", "Typically uses the mid-market rate plus a disclosed fee"],
  ["International payments", "Supported broadly, but additional international and conversion charges may apply", "Designed heavily around international money movement"],
  ["Ecommerce checkout", "Strong consumer-facing checkout ecosystem", "Not a direct equivalent to PayPal checkout"],
  ["Multi-currency", "Supported in various ways depending on account and market", "Core product strength"],
  ["Fee transparency", "Depends on fee schedule, account type, and transaction", "Quote-based pricing generally exposes transaction cost clearly"],
];

const costFactors = [
  ["Processing fee", "The percentage or transaction fee charged by the provider."],
  ["Fixed fee", "Some payment types add a fixed amount per transaction."],
  ["International surcharge", "Cross-border payments may include additional fees depending on sender and recipient markets."],
  ["Currency conversion", "The exchange rate and conversion spread can materially change the final amount received."],
  ["Payout cost", "Moving money from the provider to a bank account may create an additional cost."],
  ["Refunds", "Refund treatment and returned processing fees can differ between providers."],
  ["Supported countries and currencies", "Availability varies by provider and payment route."],
];

const detailedComparisons = [
  ["Transaction fees", "PayPal commercial payments can combine a percentage fee, fixed fee, and transaction-specific rules. Wise pricing is route-based, so users should compare a current Wise quote for the same amount, currency pair, and recipient destination."],
  ["International payments", "PayPal supports many cross-border payment flows, but international add-ons and conversion charges may apply. Wise is built around international money movement and multi-currency transfers."],
  ["Currency conversion", "Currency conversion can be one of the biggest differences between the two providers. PayPal may include a currency conversion spread within the exchange rate, while Wise generally structures conversion around the mid-market exchange rate plus a separately disclosed fee."],
  ["Business payments", "PayPal can be useful for sellers, invoices, and customer-facing payment workflows. Wise can be useful for businesses that receive, hold, convert, or pay out in multiple currencies."],
  ["Ecommerce checkout", "PayPal has a stronger consumer-facing checkout ecosystem and broad buyer familiarity. Wise is not a direct replacement for PayPal checkout in many ecommerce flows."],
  ["Receiving money", "PayPal receiving costs depend on payment type, country, currency, and whether the transaction is domestic or international. Wise receiving and transfer outcomes should be checked through a current quote for the exact route."],
  ["Multi-currency use", "PayPal supports multiple currencies in various ways, but the final conversion and withdrawal details matter. Multi-currency accounts and cross-border conversion are closer to Wise's core product focus."],
  ["Fee transparency", "PayPal fees can be audited through published schedules when the right market and payment type are known. Wise quote flows generally expose the transfer cost, exchange rate, and recipient amount before sending."],
];

const comparisonFaqs: FaqItem[] = [
  { q: "Which is cheaper, PayPal or Wise?", a: "There is no universal answer. Wise is often optimized for international transfers and currency conversion, while PayPal pricing depends heavily on transaction type, country, and payment method. Compare the final amount received for your specific payment." },
  { q: "Is Wise better than PayPal for international transfers?", a: "Wise is specifically designed around international money movement and multi-currency conversion. PayPal may still be preferable when checkout, buyer familiarity, or seller payment tools are more important." },
  { q: "Which has better exchange rates, PayPal or Wise?", a: "Wise generally uses the mid-market exchange rate plus a disclosed fee. PayPal currency conversion may include a spread in the exchange rate, so the final recipient amount should be compared." },
  { q: "Is PayPal better for ecommerce?", a: "PayPal has a stronger consumer-facing checkout ecosystem and broader use as an online payment method. Wise is more focused on transfers, accounts, and currency conversion." },
  { q: "Which is better for receiving international payments?", a: "It depends on how the payer sends money, the recipient country, the currency pair, and whether checkout or transfer features matter more. Compare both providers using the same amount and recipient details." },
  { q: "Does PayPal charge more for currency conversion?", a: "PayPal currency conversion may include a spread in the exchange rate. Wise commonly presents a mid-market exchange rate plus a disclosed fee, but users should compare current quotes for the exact route." },
  { q: "Are PayPal and Wise fees the same in every country?", a: "No. Provider pricing, supported routes, payment methods, and currency rules can vary by country and account type." },
  { q: "Can I use FeeClarity to compare invoices?", a: "You can use FeeClarity to estimate the PayPal side of an invoice or seller payment, then compare it with a current Wise quote where Wise is suitable for that payment route." },
  { q: "Is FeeClarity affiliated with PayPal or Wise?", a: "No. FeeClarity is an independent fee calculation and comparison service and is not affiliated with PayPal or Wise." },
  { q: "How should I compare the real cost of a transaction?", a: "Compare the transaction fee, international fee, currency conversion, exchange rate, payout fee, and final recipient amount using the same amount, currency pair, and destination." },
];

const corePaths = new Set(["/paypal-fee-calculator/", "/paypal-reverse-fee-calculator/", "/paypal-international-fee-calculator/", "/paypal-fees/"]);
const supportPaths = new Set(["/paypal-currency-conversion-calculator/", "/paypal-fees/us/", "/methodology/", "/rate-log/"]);

function breadcrumbsForPage(page: NonNullable<ReturnType<typeof getPage>>): BreadcrumbItem[] {
  if (page.path.startsWith("/paypal-fees/") && page.path !== "/paypal-fees/") {
    return [
      { label: "Home", href: "/" },
      { label: "PayPal Fees", href: "/paypal-fees/" },
      { label: page.title, href: page.path },
    ];
  }

  if (page.path.startsWith("/paypal-vs-")) {
    return [
      { label: "Home", href: "/" },
      { label: "Comparisons", href: "/paypal-vs-wise/" },
      { label: page.title, href: page.path },
    ];
  }

  return [
    { label: "Home", href: "/" },
    { label: page.title, href: page.path },
  ];
}

function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteUrl}${item.href}`,
    })),
  };
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="not-prose rounded-lg border border-line bg-white p-5 md:p-6">
      <h2 className="text-2xl font-bold leading-tight text-ink">{title}</h2>
      <div className="mt-3 grid gap-3 text-base leading-7 text-muted">{children}</div>
    </section>
  );
}

function ContentSections({ page }: { page: NonNullable<ReturnType<typeof getPage>> }) {
  return (
    <>
      {page.sections.map((section) => (
        <ArticleSection key={section.heading} title={section.heading}>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </ArticleSection>
      ))}
      <ArticleSection title="Fee source transparency">
        <p>Where FeeClarity displays actual PayPal fee values, the source is PayPal's published fee documentation and the calculator shows the last verified date. Unsupported markets are clearly labeled rather than estimated from another country's rates.</p>
      </ArticleSection>
    </>
  );
}

const coreFaqs: Record<string, FaqItem[]> = {
  "/paypal-fee-calculator/": [
    { q: "How much does PayPal charge per transaction?", a: "PayPal fees vary by country, transaction type, payment method, and currency. FeeClarity calculates with verified published PayPal rates where supported and shows the source used." },
    { q: "How are PayPal fees calculated?", a: "Most PayPal fees combine a percentage-based fee with a fixed fee. International charges and currency conversion estimates may add separate costs." },
    { q: "How much does PayPal charge for $100?", a: "The answer depends on the selected market, transaction type, and currency. Enter $100 in the calculator to see the exact assumptions and source-backed estimate." },
    { q: "How much does PayPal charge for $1,000?", a: "A $1,000 payment may include percentage fees, fixed fees, international charges, and currency conversion costs. Use the calculator so the result follows the selected configuration." },
    { q: "Who pays PayPal fees?", a: "For many commercial receiving scenarios, the recipient or seller pays the processing fee. Contract terms and payment setup can affect who ultimately bears the cost." },
  ],
  "/paypal-reverse-fee-calculator/": [
    { q: "How much should I charge to receive $100?", a: "Use the reverse calculator with $100 as the target amount. FeeClarity solves backward from your desired net amount using the selected PayPal fee rule." },
    { q: "How do I calculate PayPal fees backward?", a: "For percentage plus fixed-fee transactions, the gross amount is estimated from (target net + fixed fee) divided by (1 - percentage rate)." },
    { q: "Why can't I just add the PayPal percentage?", a: "PayPal calculates the percentage from the gross amount charged, not from the amount you want to receive. That is why reverse calculation must solve backward." },
    { q: "Can I use this for invoices?", a: "Yes, use it for invoice planning when the selected transaction type and country match your payment. Confirm the final amount in PayPal before sending." },
    { q: "Does the sender or recipient pay the fee?", a: "For many business payments, the recipient receives the amount after fees. The actual economic cost may be handled by pricing, invoice terms, or agreement with the sender." },
  ],
  "/paypal-international-fee-calculator/": [
    { q: "Does PayPal charge international fees?", a: "PayPal can apply additional percentage-based fees when sender and recipient accounts are in different markets. FeeClarity separates that charge from base processing fees where verified." },
    { q: "What makes a payment international?", a: "In FeeClarity, a payment is international when the sender's country and recipient's country differ, or when the international option is selected." },
    { q: "Are cross-border fees the same everywhere?", a: "No. International fee rules can vary by recipient market, sender market, transaction type, and currency." },
    { q: "Does currency conversion cost extra?", a: "Currency conversion may add a separate estimated cost when PayPal converts one currency into another. Exchange rates can change before payment." },
    { q: "Are international fees different by country?", a: "Yes. FeeClarity uses supported country-specific rules and blocks unsupported configurations instead of substituting another country's fee schedule." },
  ],
  "/paypal-fees/": [
    { q: "How much does PayPal charge?", a: "PayPal charges depend on the market, payment type, amount, currency, and whether the transaction is domestic or international." },
    { q: "What are PayPal Goods & Services fees?", a: "Goods & Services fees are commercial payment fees and may differ from checkout, invoice, merchant card, or personal payment rules." },
    { q: "Does PayPal charge currency conversion fees?", a: "PayPal currency conversion may include a spread in the exchange rate. FeeClarity separates estimated conversion costs when conversion is selected." },
    { q: "Are PayPal fees different by country?", a: "Yes. PayPal publishes different fee schedules by market, and FeeClarity uses verified local rules only where available." },
    { q: "Can businesses get custom pricing?", a: "Some businesses may have custom or special pricing. FeeClarity's standard calculator uses published rates unless a custom rate feature is explicitly entered by the user." },
  ],
};

const faqIntroByPath: Record<string, string> = {
  "/paypal-fee-calculator/": "Common questions about PayPal transaction fees and how this calculator works.",
  "/paypal-reverse-fee-calculator/": "Common questions about reverse PayPal fee calculations, invoices, and exact net amounts.",
  "/paypal-international-fee-calculator/": "Common questions about international PayPal fees, cross-border payments, and currency conversion.",
  "/paypal-fees/": "Common questions about PayPal fee rates, international charges, fixed fees, and currency conversion.",
  "/paypal-currency-conversion-calculator/": "Common questions about PayPal exchange rates, market reference rates, and conversion-cost estimates.",
  "/paypal-fees/us/": "Common questions about verified US PayPal fees and how FeeClarity applies US rules.",
  "/methodology/": "Common questions about FeeClarity's calculation rules, source policy, and unsupported configurations.",
  "/rate-log/": "Common questions about verification dates, rate sources, and the public update log.",
};

const transactionLabels: Record<string, string> = {
  goods_services: "Goods & Services",
  invoice: "Invoice",
  commercial: "Commercial payment",
  merchant: "Merchant card payment",
};

const countryNames: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  AU: "Australia",
  PH: "Philippines",
  IN: "India",
};

const supportFaqs: Record<string, FaqItem[]> = {
  "/paypal-currency-conversion-calculator/": [
    { q: "Is the market reference rate PayPal's exchange rate?", a: "No. The reference rate is a neutral benchmark. PayPal's displayed transaction exchange rate may differ and can be entered manually when available." },
    { q: "Why should I avoid double-counting conversion cost?", a: "If you enter PayPal's final displayed rate and also apply a separate conversion-spread estimate, the same exchange-rate difference may be counted twice." },
    { q: "Where does the reference rate come from?", a: "The calculator can load a latest daily reference rate from Frankfurter when that currency pair is available." },
  ],
  "/paypal-fees/us/": [
    { q: "Are these all PayPal fees in the United States?", a: "No. This page shows only US PayPal rules that are verified and implemented in FeeClarity. Account-specific pricing and unsupported products are not estimated." },
    { q: "Do fixed fees always apply?", a: "Not always. Some supported US payment types do not apply a fixed fee in the current rule set, while others use currency-specific fixed fees." },
    { q: "Can US merchants have custom pricing?", a: "Yes. Some accounts may have custom pricing, so FeeClarity's published-rate estimates should be confirmed inside PayPal for final decisions." },
  ],
  "/methodology/": [
    { q: "Why does FeeClarity block some estimates?", a: "Unsupported markets or payment types are blocked when verified source data is unavailable. FeeClarity prefers an unavailable result over a misleading one." },
    { q: "How are international payments detected?", a: "The calculator compares sender and recipient markets, and it can also apply an explicit international setting when selected." },
    { q: "Does FeeClarity use PayPal's live transaction quote?", a: "No. It uses verified published fee schedules and user-entered or reference exchange-rate inputs where supported." },
  ],
  "/rate-log/": [
    { q: "Why is there only one timeline event?", a: "Only verified events that exist in FeeClarity's current rate metadata are shown. Historical updates are not invented." },
    { q: "What does last verified mean?", a: "It is the date FeeClarity last checked the implemented fee rule against the linked published source." },
    { q: "Are Frankfurter rates PayPal rates?", a: "No. Frankfurter rates are market-reference data only and are not presented as PayPal's final transaction exchange rate." },
  ],
};

export function generateStaticParams() {
  return contentPages.map((page) => ({ slug: page.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(pathFromSlug(slug));
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: canonical(page.path) },
    openGraph: { title: page.title, description: page.description, url: canonical(page.path), type: "website" },
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(pathFromSlug(slug));
  if (!page) notFound();
  if (page.path === "/contact/") return <ContactPage page={page} />;
  if (page.path === "/sitemap/") return <HtmlSitemapPage page={page} />;
  if (page.path === "/paypal-vs-wise/") return <PayPalVsWisePage page={page} />;
  const isUtility = page.path.includes("calculator") || page.path.includes("fees");
  const isCorePage = corePaths.has(page.path);
  const isSupportPage = supportPaths.has(page.path);
  const breadcrumbItems = breadcrumbsForPage(page);

  return (
    <>
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:py-12">
            <div className="max-w-3xl">
              <Breadcrumbs items={breadcrumbItems} />
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">FeeClarity guide</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">{page.title}</h1>
              <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>
              {isCorePage ? <HeroTrustRow ariaLabel={`${page.title} trust signals`} /> : null}
              {isSupportPage ? <SupportTrustRow path={page.path} title={page.title} /> : null}
            </div>
            {isUtility && <Calculator defaultMode={page.calculatorMode ?? "receiving"} compact={!page.path.includes("calculator")} />}
          </div>
        </section>
        <SeoArticle>
          {!isCorePage && !isSupportPage ? <Disclaimer /> : null}
          {isCorePage ? (
            <CoreLowerContent path={page.path} />
          ) : isSupportPage ? (
            <SupportLowerContent path={page.path} />
          ) : (
            <ContentSections page={page} />
          )}
          <section className="not-prose rounded-lg border border-line bg-paper p-5 md:p-6">
            <SectionHeading id={`faq-${page.path.replaceAll("/", "-")}`} title="Frequently Asked Questions">
              {faqIntroByPath[page.path] ?? "Common questions about FeeClarity estimates and source-backed PayPal fee calculations."}
            </SectionHeading>
            <div className="mt-6">
          {isCorePage ? (
            <FaqAccordion items={coreFaqs[page.path]} />
          ) : isSupportPage ? (
            <FaqAccordion items={supportFaqs[page.path]} />
          ) : (
            <FaqAccordion items={page.faq ?? [
              { q: "Is FeeClarity affiliated with PayPal?", a: "No. FeeClarity is independent and does not use PayPal branding as its own identity." },
              { q: "Why does the calculator show warnings?", a: "Warnings appear when a rate is an estimate, when currency conversion is selected, or when verified local rate data is not available." },
              { q: "Can I use this for invoices?", a: "Yes, but treat the result as an estimate and confirm final fees inside PayPal before sending an invoice." },
            ]} />
          )}
            </div>
          </section>
          {isCorePage ? (
            <>
              <RelatedTools currentPath={page.path} />
              <Disclaimer />
            </>
          ) : null}
          {isSupportPage ? <Disclaimer /> : null}
        </SeoArticle>
      </main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: `${siteUrl}${page.path}`,
      }} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      {isCorePage || isSupportPage ? (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (isCorePage ? coreFaqs[page.path] : supportFaqs[page.path]).map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }} />
      ) : null}
    </>
  );
}

function ContactPage({ page }: { page: NonNullable<ReturnType<typeof getPage>> }) {
  const breadcrumbItems = breadcrumbsForPage(page);

  return (
    <>
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="max-w-3xl">
              <Breadcrumbs items={breadcrumbItems} />
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">FeeClarity support</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">{page.title}</h1>
              <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>
            </div>
          </div>
        </section>
        <SeoArticle>
          <ArticleSection title="Contact email">
            <p>
              Email FeeClarity at{" "}
              <a href="mailto:contact@tryfeeclarity.com" className="font-semibold text-mint underline">
                contact@tryfeeclarity.com
              </a>{" "}
              for source corrections, calculator issues, accessibility concerns, policy questions, or provider expansion ideas.
            </p>
          </ArticleSection>
          {page.sections.slice(1).map((section) => (
            <ArticleSection key={section.heading} title={section.heading}>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </ArticleSection>
          ))}
          <ArticleSection title="What to include">
            <p>For fee-source corrections, include the provider, market, effective date, official source URL, and the FeeClarity page where you noticed the issue.</p>
            <p>For privacy, advertising, or accessibility concerns, include the page URL and a short description of what happened.</p>
          </ArticleSection>
        </SeoArticle>
      </main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: page.title,
        description: page.description,
        url: `${siteUrl}${page.path}`,
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FeeClarity",
        url: siteUrl,
        email: "contact@tryfeeclarity.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@tryfeeclarity.com",
          availableLanguage: "English",
        },
      }} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
    </>
  );
}

function HtmlSitemapPage({ page }: { page: NonNullable<ReturnType<typeof getPage>> }) {
  const breadcrumbItems = breadcrumbsForPage(page);
  const groups = [
    {
      title: "Calculators",
      paths: [
        "/paypal-fee-calculator/",
        "/paypal-reverse-fee-calculator/",
        "/paypal-international-fee-calculator/",
        "/paypal-currency-conversion-calculator/",
        "/paypal-invoice-fee-calculator/",
        "/paypal-goods-and-services-fee-calculator/",
        "/paypal-merchant-fee-calculator/",
      ],
    },
    {
      title: "PayPal fee guides",
      paths: [
        "/paypal-fees/",
        "/paypal-international-fees/",
        "/how-much-does-paypal-charge/",
        "/how-to-calculate-paypal-fees/",
        "/paypal-currency-conversion-fees/",
        "/paypal-fees-for-freelancers/",
        "/paypal-fees-for-business/",
        "/paypal-fees-for-invoices/",
      ],
    },
    {
      title: "Country fee pages",
      paths: [
        "/paypal-fees/us/",
        "/paypal-fees/canada/",
        "/paypal-fees/uk/",
        "/paypal-fees/australia/",
        "/paypal-fees/philippines/",
        "/paypal-fees/india/",
      ],
    },
    {
      title: "Comparisons and trust",
      paths: [
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
      ],
    },
  ];

  return (
    <>
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="max-w-3xl">
              <Breadcrumbs items={breadcrumbItems} />
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">FeeClarity directory</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">{page.title}</h1>
              <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
          {groups.map((group) => (
            <nav key={group.title} aria-labelledby={`sitemap-${group.title.toLowerCase().replaceAll(" ", "-")}`} className="rounded-lg border border-line bg-white p-5 md:p-6">
              <h2 id={`sitemap-${group.title.toLowerCase().replaceAll(" ", "-")}`} className="text-2xl font-bold text-ink">{group.title}</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
                {group.paths.map((path) => {
                  const target = getPage(path);
                  return (
                    <li key={path}>
                      <Link href={path} className="font-semibold text-mint hover:text-ink">{target?.title ?? path}</Link>
                      {target?.description ? <p className="mt-1">{target.description}</p> : null}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </section>
      </main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: `${siteUrl}${page.path}`,
      }} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
    </>
  );
}

function CoreLowerContent({ path }: { path: string }) {
  if (path === "/paypal-reverse-fee-calculator/") return <ReverseLowerContent />;
  if (path === "/paypal-international-fee-calculator/") return <InternationalLowerContent />;
  if (path === "/paypal-fees/") return <FeesGuideLowerContent />;
  return <CalculatorLowerContent />;
}

function SupportTrustRow({ path, title }: { path: string; title: string }) {
  const checked = formattedPaypalVerificationDate ? `Last checked ${formattedPaypalVerificationDate}` : "Published PayPal fee sources";
  const itemsByPath: Record<string, string[]> = {
    "/paypal-currency-conversion-calculator/": ["Independent calculation", "Reference rates clearly labeled", "PayPal fees sourced separately"],
    "/paypal-fees/us/": ["Verified US fee rules", "Published PayPal sources", checked],
    "/methodology/": ["Source-backed rules", "Unsupported data is blocked", "Calculation assumptions are visible"],
    "/rate-log/": ["Public verification history", "Source-backed rate updates", "Independent audit trail"],
  };

  return (
    <div className="mt-5">
      <TrustStrip
        ariaLabel={`${title} trust signals`}
        items={itemsByPath[path] ?? ["Independent tool", "Published PayPal fee sources", "Source-backed estimates"]}
        note="FeeClarity is not affiliated with PayPal."
      />
    </div>
  );
}

function SupportLowerContent({ path }: { path: string }) {
  if (path === "/paypal-currency-conversion-calculator/") return <CurrencyConversionLowerContent />;
  if (path === "/paypal-fees/us/") return <UsFeesLowerContent />;
  if (path === "/methodology/") return <MethodologyLowerContent />;
  return <RateLogLowerContent />;
}

function CurrencyConversionLowerContent() {
  return (
    <>
      <section className="not-prose">
        <SectionHeading title="Conversion costs should be visible">
          PayPal currency conversion should be reviewed separately from processing fees, international add-ons, and ordinary exchange-rate movement.
        </SectionHeading>
        <div className="mt-6 grid gap-3 text-center md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {[
            ["Market reference rate", "A neutral benchmark used to compare the underlying currency value.", "Recent daily rate when available"],
            ["PayPal displayed rate", "The exchange rate PayPal displays for the transaction, when available.", "Manual entry when you have it"],
            ["Estimated conversion cost", "The estimated cost created by the difference between the reference market rate and PayPal's transaction rate.", "Shown separately from fees"],
          ].map(([title, body, meta], index) => (
            <Fragment key={title}>
              {index > 0 ? <span aria-hidden="true" className="hidden self-center text-mint md:block">→</span> : null}
              <section className="rounded-lg border border-line bg-white p-5 text-left">
                <p className="text-sm font-semibold uppercase tracking-wide text-mint">{meta}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-base leading-7 text-muted">{body}</p>
              </section>
            </Fragment>
          ))}
        </div>
      </section>

      <section className="not-prose rounded-lg border border-line bg-paper p-5 md:p-6">
        <SectionHeading title="Reference exchange rate">
          FeeClarity can preload a recent daily market reference rate from Frankfurter when available. This is a benchmark only and is not presented as PayPal's final transaction exchange rate.
        </SectionHeading>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">Reference rate</dt>
            <dd className="mt-2 text-muted">Loaded dynamically in the calculator when Frankfurter supports the selected pair.</dd>
          </div>
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">Use custom PayPal rate</dt>
            <dd className="mt-2 text-muted">Paste PayPal's displayed exchange rate into the calculator to compare the actual transaction quote.</dd>
          </div>
        </dl>
      </section>

      <ImportantNote title="Avoid double-counting conversion cost">
        If you manually enter PayPal's displayed transaction exchange rate, disable any separate conversion-spread estimate that would count the same difference twice.
      </ImportantNote>

      <PageInfoCard
        title="When this calculator is useful"
        intro="Use this page when the exchange-rate portion of a PayPal payment matters."
        items={[
          "Customer pays in one currency and you receive another",
          "You want to estimate PayPal's FX impact",
          "You want to compare PayPal with another provider",
          "You have a PayPal-displayed exchange rate and want to compare it with a market reference",
        ]}
      />

      <SourceTransparencyCard source={PAYPAL_CONSUMER_SOURCE_US} market="Currency conversion spread reference" />
    </>
  );
}

function UsFeesLowerContent() {
  const examples = [
    ["$100 domestic commercial payment", calculateFees({ amount: "100", mode: "receiving", accountCountry: "US", otherCountry: "US", transactionType: "commercial", paymentCurrency: "USD", receivingCurrency: "USD" })],
    ["$1,000 domestic commercial payment", calculateFees({ amount: "1000", mode: "receiving", accountCountry: "US", otherCountry: "US", transactionType: "commercial", paymentCurrency: "USD", receivingCurrency: "USD" })],
    ["US recipient receiving an international payment", calculateFees({ amount: "1000", mode: "receiving", accountCountry: "US", otherCountry: "CA", transactionType: "commercial", paymentCurrency: "USD", receivingCurrency: "USD" })],
  ] as const;

  return (
    <>
      <UsFeeTable />

      <section className="not-prose">
        <SectionHeading title="How US PayPal fees are determined" />
        <div className="mt-6">
          <FeeComponentGrid items={[
            { title: "Transaction type", description: "Different PayPal products can use different percentage rates." },
            { title: "Fixed fee", description: "The fixed portion can vary with the receiving currency." },
            { title: "International status", description: "Cross-border payments may add international charges." },
            { title: "Currency conversion", description: "Currency conversion is separate from the processing fee." },
            { title: "Custom pricing", description: "Some merchants may have account-specific pricing that differs from standard published rates." },
          ]} />
        </div>
      </section>

      <PageInfoCard
        title="Before relying on a fee rate, verify"
        intro="Confirm the details that affect which published rule applies."
        items={["Domestic processing rate", "International surcharge", "Fixed fee for the receiving currency", "Payment method eligibility", "Currency conversion treatment", "Account-specific or custom pricing"]}
      />

      <section className="not-prose">
        <SectionHeading title="Common US examples">
          These examples use the currently verified US commercial payment rules implemented in FeeClarity. They do not apply to every PayPal product or account.
        </SectionHeading>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {examples.map(([title, result]) => (
            <section key={title} className="rounded-lg border border-line bg-white p-5">
              <h3 className="text-xl font-semibold text-ink">{title}</h3>
              <dl className="mt-4 grid gap-2 text-sm text-muted">
                <div className="flex justify-between gap-4"><dt>Amount</dt><dd className="font-medium text-ink">${result.inputAmount}</dd></div>
                <div className="flex justify-between gap-4"><dt>Rate used</dt><dd className="text-right font-medium text-ink">{result.rateUsed}</dd></div>
                <div className="flex justify-between gap-4"><dt>Total fee</dt><dd className="font-medium text-ink">${result.totalFees}</dd></div>
                <div className="flex justify-between gap-4"><dt>Estimated received</dt><dd className="font-medium text-ink">${result.netReceived}</dd></div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-muted">{result.assumptions.join("; ")}.</p>
              <a href={result.source.url} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">Source <ArrowRight size={15} aria-hidden="true" /></a>
            </section>
          ))}
        </div>
      </section>

      <SourceTransparencyCard source={PAYPAL_SOURCE_US} market="United States" />
    </>
  );
}

function UsFeeTable() {
  const rows = paypalRules.filter((rule) => rule.country === "US");

  return (
    <section id="current-us-paypal-fees" className="not-prose">
      <SectionHeading title="Current PayPal fees in the United States">
        Only verified US PayPal fee rules currently implemented in FeeClarity are shown here.
      </SectionHeading>
      <div className="mt-6 overflow-x-auto rounded border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Verified US PayPal fee rules implemented in FeeClarity</caption>
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3">Payment type</th>
              <th className="px-4 py-3">Percentage rate</th>
              <th className="px-4 py-3">Fixed fee</th>
              <th className="px-4 py-3">Applicable market</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Last verified</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rule) => (
              <tr key={`${rule.country}-${rule.transactionType}-${rule.product}`} className="border-t border-line align-top">
                <th scope="row" className="px-4 py-3 font-medium text-ink">{transactionLabels[rule.transactionType] ?? rule.transactionType}</th>
                <td className="px-4 py-3">{rule.domesticPercent}% domestic{rule.internationalPercent !== "0.00" ? ` + ${rule.internationalPercent}% international` : ""}</td>
                <td className="px-4 py-3">{rule.appliesFixedFee === false ? "Not applied" : "Currency-specific"}</td>
                <td className="px-4 py-3">United States</td>
                <td className="px-4 py-3">{rule.source.notes}</td>
                <td className="px-4 py-3">{rule.source.lastVerified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="US PayPal fee table source links" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint">
        <a href={PAYPAL_SOURCE_US.url} className="inline-flex items-center gap-1">Official source <ArrowRight size={15} aria-hidden="true" /></a>
        <Link href="/methodology/" className="inline-flex items-center gap-1">Methodology <ArrowRight size={15} aria-hidden="true" /></Link>
        <Link href="/rate-log/" className="inline-flex items-center gap-1">Rate log <ArrowRight size={15} aria-hidden="true" /></Link>
      </nav>
    </section>
  );
}

function MethodologyLowerContent() {
  return (
    <>
      <section className="not-prose rounded-lg border border-line bg-paper p-5 md:p-6">
        <SectionHeading eyebrow="FeeClarity transparency" title="Calculation decision flow">
          FeeClarity turns transaction inputs into a supported result by selecting verified rules and showing the assumptions used.
        </SectionHeading>
        <ol className="mt-6 grid gap-3">
          {[
            ["Recipient country", "Select applicable PayPal fee schedule"],
            ["Sender country", "Determine domestic vs international"],
            ["Transaction type", "Select processing rate"],
            ["Receiving currency", "Select applicable fixed fee"],
            ["Currency conversion?", "Apply reference-rate or conversion logic when supported"],
            ["FeeClarity result", "Show rate, source, dates, assumptions, formula, and limitations"],
          ].map(([input, action], index) => (
            <li key={input} className="grid gap-3 rounded border border-line bg-white p-4 sm:grid-cols-[40px_1fr_1.4fr] sm:items-center">
              <span className="grid size-9 place-items-center rounded border border-line bg-paper text-sm font-semibold text-mint" aria-hidden="true">{index + 1}</span>
              <strong className="text-ink">{input}</strong>
              <span className="text-base leading-7 text-muted">{action}</span>
            </li>
          ))}
        </ol>
      </section>

      <StepList
        title="How rates are selected"
        steps={[
          "Choose the applicable market: the recipient's PayPal market determines the base fee schedule.",
          "Classify the transaction: sender and recipient markets determine whether the payment is domestic or international.",
          "Select the payment product: the selected transaction type determines which verified percentage and fixed-fee rules apply.",
          "Apply currency rules: the receiving currency determines the fixed fee where applicable.",
          "Apply additional supported rules: international and currency-conversion logic is added only when supported by verified rules.",
        ]}
      />

      <section className="not-prose">
        <SectionHeading title="How exchange rates are handled" />
        <div className="mt-6">
          <FeeComponentGrid items={[
            { title: "Market reference rate", description: "FeeClarity can use recent Frankfurter market rates as a neutral reference when available." },
            { title: "PayPal displayed rate", description: "PayPal's actual transaction exchange rate may differ from the market reference." },
            { title: "Manual override", description: "Users can enter a PayPal-displayed rate when available." },
            { title: "Important limitation", description: "FeeClarity does not present the market reference rate as PayPal's final transaction rate." },
          ]} />
        </div>
      </section>

      <PageInfoCard
        title="What every supported result shows"
        intro="Supported calculator results expose the data needed to audit the estimate."
        items={["Rate used", "Official source", "Effective date", "Last verification date", "Assumptions", "Formula", "Limitations"]}
      />

      <ImportantNote title="What happens when verified data is unavailable">
        Unsupported payment types, markets, or domestic rules are blocked rather than estimated using invented values or unrelated country schedules. FeeClarity prefers an unavailable result over a misleading result.
      </ImportantNote>

      <SourceTransparencyCard />
    </>
  );
}

function RateLogLowerContent() {
  const uniqueSources = Array.from(new Map(paypalRules.map((rule) => [rule.source.label, rule.source])).values());
  const verifiedMarkets = Array.from(new Set(paypalRules.map((rule) => rule.country))).sort();
  const latestDate = paypalVerificationDate;
  const formattedLatest = formattedPaypalVerificationDate ?? latestDate ?? "Not currently available";

  return (
    <>
      <section className="not-prose rounded-lg border border-line bg-paper p-5 md:p-6">
        <SectionHeading title="Latest verification">
          Each supported calculation links to the official source used for that market.
        </SectionHeading>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">Date</dt>
            <dd className="mt-2 text-muted">{formattedLatest}</dd>
          </div>
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">Status</dt>
            <dd className="mt-2 text-muted">Verified</dd>
          </div>
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">Markets reviewed</dt>
            <dd className="mt-2 text-muted">{verifiedMarkets.map((market) => countryNames[market] ?? market).join(", ")}</dd>
          </div>
        </dl>
      </section>

      <section className="not-prose">
        <SectionHeading title="Verification timeline">
          Only verified events present in the current FeeClarity rate metadata are shown.
        </SectionHeading>
        <ol className="mt-6 border-l border-line pl-5">
          <li className="relative pb-2">
            <span className="absolute -left-[29px] top-1 grid size-4 place-items-center rounded-full border border-mint bg-white" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">{formattedLatest}</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Verified PayPal fee schedules</h3>
            <p className="mt-2 text-base leading-7 text-muted">Markets: {verifiedMarkets.map((market) => countryNames[market] ?? market).join(", ")}. Fee category: commercial receiving rules and supported currency-conversion spread metadata.</p>
            <nav aria-label="Timeline source links" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint">
              {uniqueSources.slice(0, 3).map((source) => <a key={source.url} href={source.url}>View source</a>)}
              <Link href="/methodology/">Methodology</Link>
            </nav>
          </li>
        </ol>
      </section>

      <RateLogTable />

      <section className="not-prose rounded-lg border border-line bg-white p-5 md:p-6">
        <SectionHeading title="Exchange-rate reference data">
          These rates are not presented as PayPal's final transaction exchange rate.
        </SectionHeading>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded border border-line bg-paper p-4"><dt className="font-semibold text-ink">Provider</dt><dd className="mt-2 text-muted">Frankfurter</dd></div>
          <div className="rounded border border-line bg-paper p-4"><dt className="font-semibold text-ink">Purpose</dt><dd className="mt-2 text-muted">Market reference only</dd></div>
          <div className="rounded border border-line bg-paper p-4"><dt className="font-semibold text-ink">Frequency</dt><dd className="mt-2 text-muted">Latest daily rate when available</dd></div>
        </dl>
      </section>

      <PageInfoCard
        title="Why maintain a public rate log?"
        intro="A visible audit trail helps users understand when a fee rule was last reviewed."
        items={["PayPal can change published pricing", "Fixed fees can change", "Payment-method eligibility can change", "International add-ons can change", "Currency-conversion language can change", "Users should be able to see when FeeClarity last reviewed a rule"]}
      />
    </>
  );
}

function RateLogTable() {
  const rows = Array.from(new Map(paypalRules.map((rule) => [`${rule.country}-${rule.product}-${rule.source.url}`, rule])).values());

  return (
    <section className="not-prose">
      <SectionHeading title="Structured verification log" />
      <div className="mt-6 overflow-x-auto rounded border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">PayPal fee source verification log</caption>
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3">Verified date</th>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Fee category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rule) => (
              <tr key={`${rule.country}-${rule.product}`} className="border-t border-line align-top">
                <td className="px-4 py-3">{rule.source.lastVerified}</td>
                <th scope="row" className="px-4 py-3 font-medium text-ink">{countryNames[rule.country] ?? rule.country}</th>
                <td className="px-4 py-3">{rule.product.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">Verified</td>
                <td className="px-4 py-3"><a href={rule.source.url}>View source</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CalculatorLowerContent() {
  return (
    <>
      <PageInfoCard
        title="What this calculator is best for"
        intro="Use the main calculator when you need a general PayPal fee estimate for common commercial payment scenarios."
        items={["Goods & Services", "Commercial payments", "Invoices", "Merchant card payments", "General PayPal fee estimates"]}
        outro="The result separates each fee component so you can see where the total cost comes from."
      />
      <section className="not-prose">
        <SectionHeading title="Why FeeClarity tracks rates">
          PayPal fees vary by market and payment product. FeeClarity stores rates separately with effective dates, verification dates, and source links so calculations can be audited and updated when PayPal changes pricing.
        </SectionHeading>
      </section>
      <SourceTransparencyCard />
    </>
  );
}

function ReverseLowerContent() {
  return (
    <>
      <section className="not-prose rounded-lg border border-line bg-paper p-5 md:p-6">
        <SectionHeading title="How reverse PayPal fee calculation works">
          Reverse calculation starts with the net amount you need to receive and solves for the approximate gross amount required before PayPal fees are deducted.
        </SectionHeading>
        <div className="mt-6 grid gap-3 text-center text-sm font-semibold uppercase tracking-wide text-muted md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <div className="rounded border border-line bg-white p-4">
            <span className="block text-xs text-muted">You want to receive</span>
            <strong className="mt-1 block text-2xl normal-case tracking-normal text-ink">$1,000</strong>
          </div>
          <span aria-hidden="true" className="text-mint">→</span>
          <div className="rounded border border-line bg-white p-4">
            <span className="block text-xs text-muted">FeeClarity</span>
            <strong className="mt-1 block text-xl normal-case tracking-normal text-ink">solves backward</strong>
          </div>
          <span aria-hidden="true" className="text-mint">→</span>
          <div className="rounded border border-line bg-white p-4">
            <span className="block text-xs text-muted">You should charge</span>
            <strong className="mt-1 block text-2xl normal-case tracking-normal text-ink">$1,036.67</strong>
          </div>
        </div>
      </section>
      <FormulaCard title="Reverse fee formula" formula="Gross amount = (Target net + Fixed fee) / (1 - Percentage rate)">
        PayPal calculates the percentage fee from the gross amount charged, not from the amount you want to receive. FeeClarity therefore solves backward from the target net amount.
      </FormulaCard>
      <ImportantNote title="Rounding note">
        FeeClarity rounds the requested amount to normal currency precision after solving the fee equation. Final processor charges may differ slightly because payment processors can round individual fee components.
      </ImportantNote>
      <SourceTransparencyCard />
    </>
  );
}

function InternationalLowerContent() {
  return (
    <>
      <section className="not-prose">
        <SectionHeading title="International payments can include multiple cost layers" />
        <div className="mt-6">
          <FeeComponentGrid items={[
            { title: "Base processing fee", description: "The standard transaction fee for the selected payment type and recipient market." },
            { title: "International surcharge", description: "An additional cost that may apply when sender and recipient PayPal accounts are registered in different markets." },
            { title: "Currency conversion", description: "A separate estimated cost when PayPal converts one currency into another." },
            { title: "Fixed fee", description: "A fixed transaction amount that can vary based on the receiving currency." },
          ]} />
        </div>
      </section>
      <StepList
        title="How to use the international calculator"
        steps={[
          "Enter the payment amount.",
          "Select the sender's country.",
          "Select the recipient's country.",
          "Choose the payment currency.",
          "Choose the receiving currency.",
          "Select the transaction type.",
          "Confirm whether currency conversion applies.",
        ]}
      />
      <section className="not-prose rounded-lg border border-line bg-paper p-5 md:p-6">
        <SectionHeading title="Transaction status example">
          FeeClarity classifies a transaction as international when the sender and recipient PayPal accounts are registered in different markets.
        </SectionHeading>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">International transaction detected</dt>
            <dd className="mt-2 text-muted">Sender: United States<br />Recipient: Canada</dd>
          </div>
          <div className="rounded border border-line bg-white p-4">
            <dt className="font-semibold text-ink">Currency conversion detected</dt>
            <dd className="mt-2 text-muted">USD → CAD when payment and receiving currencies differ.</dd>
          </div>
        </dl>
      </section>
      <SourceTransparencyCard />
    </>
  );
}

function FeesGuideLowerContent() {
  return (
    <>
      <OnThisPage links={[
        { href: "#current-paypal-fees", label: "Current PayPal fees" },
        { href: "#transaction-details", label: "Transaction details" },
        { href: "#fee-components", label: "Fee components" },
        { href: "#source-transparency", label: "Source transparency" },
        { href: "#faq--paypal-fees-", label: "Frequently Asked Questions" },
      ]} />
      <section id="transaction-details" className="not-prose">
        <SectionHeading title="Start with the transaction details">
          Before relying on a fee estimate, identify the fields that affect which PayPal rule applies.
        </SectionHeading>
        <ul className="mt-5 grid gap-2 rounded-lg border border-line bg-white p-5 text-base leading-7 text-muted sm:grid-cols-2">
          {["Payment amount", "Sender's country", "Recipient's country", "Transaction type", "Payment currency", "Receiving currency", "Whether currency conversion is required"].map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-mint" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-7 text-muted">PayPal pricing can vary across these fields, so one-rate answers can be misleading.</p>
      </section>
      <ImportantNote title="Use estimates carefully">
        FeeClarity separates processing costs from currency-conversion estimates and links calculations to source-backed assumptions. Confirm the final fee inside PayPal before committing to pricing, invoicing, or reimbursement terms.
      </ImportantNote>
      <FeesGuideRateTable />
      <section id="fee-components" className="not-prose">
        <SectionHeading title="How PayPal fees are structured" />
        <div className="mt-6">
          <FeeComponentGrid items={[
            { title: "Processing fee", description: "The percentage-based portion of many PayPal commercial transactions." },
            { title: "Fixed fee", description: "A currency-specific amount that can be added to eligible transactions." },
            { title: "International surcharge", description: "An additional percentage that may apply across sender and recipient markets." },
            { title: "Currency conversion", description: "An exchange-rate spread or conversion estimate when PayPal converts currencies." },
            { title: "Special or custom pricing", description: "Some accounts may have custom pricing that should be confirmed inside PayPal." },
          ]} />
        </div>
      </section>
      <div id="source-transparency">
        <SourceTransparencyCard />
      </div>
    </>
  );
}

function FeesGuideRateTable() {
  const rows = paypalRules.filter((rule) => rule.transactionType === "commercial" || rule.country === "US");

  return (
    <section id="current-paypal-fees" className="not-prose">
      <SectionHeading title="Current PayPal fees">
        These rows use verified PayPal fee rules currently implemented in FeeClarity. Fixed fees vary by receiving currency where the official schedule provides currency-specific values.
      </SectionHeading>
      <div className="not-prose overflow-x-auto rounded border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3">Payment type</th>
              <th className="px-4 py-3">Percentage rate</th>
              <th className="px-4 py-3">Fixed fee</th>
              <th className="px-4 py-3">Applicable market</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Last verified</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rule) => (
              <tr key={`${rule.country}-${rule.transactionType}-${rule.product}`} className="border-t border-line align-top">
                <th scope="row" className="px-4 py-3 font-medium text-ink">{transactionLabels[rule.transactionType] ?? rule.transactionType}</th>
                <td className="px-4 py-3">{rule.domesticPercent}% domestic{rule.internationalPercent !== "0.00" ? ` + ${rule.internationalPercent}% international` : ""}</td>
                <td className="px-4 py-3">{rule.appliesFixedFee === false ? "Not applied" : "Currency-specific"}</td>
                <td className="px-4 py-3">{rule.country}</td>
                <td className="px-4 py-3"><a href={rule.source.url}>{rule.source.label}</a></td>
                <td className="px-4 py-3">{rule.source.lastVerified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="PayPal fee table source links" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint">
        <a href={PAYPAL_SOURCE_US.url} className="inline-flex items-center gap-1">Official source <ArrowRight size={15} aria-hidden="true" /></a>
        <Link href="/methodology/" className="inline-flex items-center gap-1">Methodology <ArrowRight size={15} aria-hidden="true" /></Link>
        <Link href="/rate-log/" className="inline-flex items-center gap-1">Rate log <ArrowRight size={15} aria-hidden="true" /></Link>
      </nav>
    </section>
  );
}

function PayPalVsWisePage({ page }: { page: NonNullable<ReturnType<typeof getPage>> }) {
  const breadcrumbItems = breadcrumbsForPage(page);
  const trustSignals = [
    "Independent comparison",
    formattedPaypalVerificationDate ? `PayPal rates verified ${formattedPaypalVerificationDate}` : "Published PayPal fee sources",
    "Wise pricing should be confirmed with a current quote",
  ];

  return (
    <>
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="max-w-[780px]">
              <Breadcrumbs items={breadcrumbItems} />
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">Independent - transparent fee comparison</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">{page.title}</h1>
              <p className="mt-4 max-w-[720px] text-lg leading-8 text-muted md:text-xl md:leading-8">{page.description}</p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted" aria-label="Comparison trust signals">
                {trustSignals.map((signal) => (
                  <li key={signal} className="inline-flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-mint" aria-hidden="true" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
              <nav aria-label="Comparison transparency" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint">
                <Link href="/methodology/" className="inline-flex items-center gap-1">View methodology <ArrowRight size={15} aria-hidden="true" /></Link>
                <Link href="/rate-log/" className="inline-flex items-center gap-1">View rate log <ArrowRight size={15} aria-hidden="true" /></Link>
              </nav>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_270px]">
          <article className="grid min-w-0 gap-14">
            <section className="rounded-lg border border-line bg-paper p-5 md:p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-mint">Quick verdict</p>
              <div className="mt-4 grid gap-4 text-base leading-7 text-muted">
                <p>PayPal is generally stronger for ecommerce checkout, customer-facing payments, and broad buyer familiarity.</p>
                <p>Wise is generally stronger for international transfers, multi-currency payments, and transparent foreign-exchange pricing.</p>
                <p>The cheaper option depends on the amount, sender and recipient countries, currencies involved, and payment method.</p>
              </div>
            </section>

            <section aria-labelledby="best-for-heading">
              <h2 id="best-for-heading" className="text-3xl font-bold leading-tight text-ink">Best suited for</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <BestForCard title="PayPal is better suited for" items={["Online checkout", "Customer payments", "Ecommerce", "Buyer familiarity", "Seller payment workflows"]} />
                <BestForCard title="Wise is better suited for" items={["International transfers", "Multi-currency balances", "Currency conversion transparency", "Cross-border payouts", "Freelancers or businesses receiving foreign currencies"]} />
              </div>
            </section>

            <section aria-labelledby="glance-heading">
              <h2 id="glance-heading" className="text-3xl font-bold leading-tight text-ink">PayPal vs Wise at a glance</h2>
              <div className="mt-6 overflow-x-auto rounded border border-line bg-white">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-paper text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Factor</th>
                      <th className="px-4 py-3 font-semibold">PayPal</th>
                      <th className="px-4 py-3 font-semibold">Wise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([factor, paypal, wise]) => (
                      <tr key={factor} className="border-t border-line align-top">
                        <th scope="row" className="px-4 py-4 font-semibold text-ink">{factor}</th>
                        <td className="px-4 py-4 leading-6 text-muted">{paypal}</td>
                        <td className="px-4 py-4 leading-6 text-muted">{wise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="cost-heading">
              <h2 id="cost-heading" className="text-3xl font-bold leading-tight text-ink">What actually affects the cost?</h2>
              <dl className="mt-6 grid gap-4 md:grid-cols-2">
                {costFactors.map(([term, detail]) => (
                  <div key={term} className="rounded border border-line bg-white p-5">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-mint">{term}</dt>
                    <dd className="mt-2 text-base leading-7 text-muted">{detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="details-heading">
              <h2 id="details-heading" className="text-3xl font-bold leading-tight text-ink">Detailed comparison</h2>
              <div className="mt-6 grid gap-7">
                {detailedComparisons.map(([heading, body]) => (
                  <section key={heading} className="border-t border-line pt-6">
                    <h3 className="text-xl font-semibold text-ink">{heading}</h3>
                    <p className="mt-3 text-base leading-7 text-muted">{body}</p>
                  </section>
                ))}
              </div>
            </section>

            <section aria-labelledby="workflow-heading" className="rounded-lg border border-line bg-paper p-5 md:p-6">
              <h2 id="workflow-heading" className="text-3xl font-bold leading-tight text-ink">How to compare your actual transaction</h2>
              <ol className="mt-6 grid gap-4">
                {[
                  ["Run the PayPal calculation", "Enter the transaction amount, sender country, recipient country, currency, and payment type in FeeClarity."],
                  ["Get a current Wise quote", "Use Wise's current quote for the same amount, currency pair, and recipient destination."],
                  ["Compare the total cost", "Review the transaction fee, international fee, currency conversion, exchange rate, payout fee, and recipient amount."],
                  ["Compare what the recipient actually receives", "Do not compare only the advertised percentage. The final received amount is usually the most useful measure."],
                  ["Confirm before sending", "Fees can change based on the final payment configuration, so confirm the live provider quote before completing the transaction."],
                ].map(([heading, body], index) => (
                  <li key={heading} className="grid gap-2 sm:grid-cols-[40px_1fr]">
                    <span className="grid size-9 place-items-center rounded border border-line bg-white text-sm font-semibold text-mint" aria-hidden="true">{index + 1}</span>
                    <span>
                      <span className="block font-semibold text-ink">{heading}</span>
                      <span className="mt-1 block text-base leading-7 text-muted">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/paypal-fee-calculator/" className="inline-flex items-center gap-1 rounded border border-line bg-white px-4 py-2 text-sm font-semibold text-mint">Run PayPal estimate <ArrowRight size={15} aria-hidden="true" /></Link>
                <Link href="/paypal-currency-conversion-calculator/" className="inline-flex items-center gap-1 rounded border border-line bg-white px-4 py-2 text-sm font-semibold text-mint">Check conversion estimate <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </section>

            <section aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-3xl font-bold leading-tight text-ink">How FeeClarity sources fee data</h2>
              <div className="mt-4 grid gap-4 text-base leading-7 text-muted">
                <p>FeeClarity uses published provider documentation whenever verified fee data is displayed.</p>
                <p>PayPal calculations show the applicable rate source and verification date. Current PayPal rules in FeeClarity were last verified {paypalVerificationDate ?? "in the rate log"}.</p>
                <p>FeeClarity does not currently include a verified Wise pricing engine, so this page directs users to confirm a current Wise quote instead of estimating unsupported rates.</p>
              </div>
              <nav aria-label="Source transparency links" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint">
                <Link href="/methodology/" className="inline-flex items-center gap-1">View methodology <ArrowRight size={15} aria-hidden="true" /></Link>
                <Link href="/rate-log/" className="inline-flex items-center gap-1">View rate log <ArrowRight size={15} aria-hidden="true" /></Link>
              </nav>
              <p className="mt-6 rounded border border-line bg-paper p-4 text-sm leading-6 text-muted">FeeClarity is independent and is not affiliated with PayPal or Wise. Fees may vary by country, account type, payment method, transaction details, and currency conversion. PayPal and Wise trademarks belong to their respective owners.</p>
            </section>

            <section aria-labelledby="faq-heading" className="rounded-lg border border-line bg-paper p-5 md:p-6">
              <h2 id="faq-heading" className="text-3xl font-bold leading-tight text-ink">Frequently asked questions</h2>
              <p className="mt-3 text-base leading-7 text-muted">Common questions about PayPal vs Wise fees, international payments, and currency conversion.</p>
              <div className="mt-6">
                <FaqAccordion items={comparisonFaqs} />
              </div>
            </section>

            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-3xl font-bold leading-tight text-ink">Related tools</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["/paypal-fee-calculator/", "PayPal Fee Calculator"],
                  ["/paypal-reverse-fee-calculator/", "Reverse PayPal Fee Calculator"],
                  ["/paypal-international-fee-calculator/", "International PayPal Fee Calculator"],
                  ["/paypal-currency-conversion-calculator/", "Currency Conversion Calculator"],
                  ["/paypal-fees/", "PayPal Fees Guide"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="rounded border border-line bg-white p-4 text-sm font-semibold text-mint hover:border-mint hover:bg-paper">{label}</Link>
                ))}
              </div>
            </section>
          </article>

          <ComparisonSidebar />
        </div>
      </main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: `${siteUrl}${page.path}`,
      }} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: comparisonFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }} />
    </>
  );
}

function BestForCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 md:p-6">
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      <ul className="mt-4 grid gap-2 text-base leading-7 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 size={16} className="mt-1 shrink-0 text-mint" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ComparisonSidebar() {
  return (
    <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
      <nav aria-label="Related calculators" className="rounded border border-line bg-white p-4 text-sm">
        <h2 className="font-semibold text-ink">Related calculators</h2>
        <ul className="mt-3 grid gap-2 text-muted">
          <li><Link href="/paypal-reverse-fee-calculator/">Reverse calculator</Link></li>
          <li><Link href="/paypal-international-fee-calculator/">International calculator</Link></li>
          <li><Link href="/paypal-currency-conversion-calculator/">Currency conversion calculator</Link></li>
        </ul>
      </nav>
      <nav aria-label="FeeClarity resources" className="rounded border border-line bg-white p-4 text-sm">
        <h2 className="font-semibold text-ink">FeeClarity resources</h2>
        <ul className="mt-3 grid gap-2 text-muted">
          <li><Link href="/paypal-fees/us/">US PayPal fees</Link></li>
          <li><Link href="/methodology/">Methodology</Link></li>
          <li><Link href="/rate-log/">Rate log</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
