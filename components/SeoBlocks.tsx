import Link from "next/link";
import { HeroTrustRow } from "@/components/HeroTrustRow";
import { Calculator } from "./Calculator";
import { calculateFees } from "@/lib/fees/engine";
import { PAYPAL_SOURCE_US } from "@/lib/fees/paypal-rules";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function PageHero({ title, description, calculatorMode }: { title: string; description: string; calculatorMode?: "receiving" | "target_receive" }) {
  return (
    <main>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-7 px-4 py-8 md:gap-8 md:py-12">
          <div className="max-w-[780px]">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Independent - verified against official rates</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-[720px] text-lg leading-8 text-muted md:text-xl md:leading-8">{description}</p>
            <HeroTrustRow ariaLabel="Calculator trust signals" />
          </div>
          <Calculator defaultMode={calculatorMode ?? "receiving"} />
        </div>
      </section>
    </main>
  );
}

export function SeoArticle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="prose prose-slate max-w-none prose-h2:mt-10 prose-h2:text-2xl prose-p:leading-7 prose-a:text-mint">
        {children}
      </article>
      <div className="grid h-fit gap-4 lg:sticky lg:top-20">
        <RelatedLinks />
      </div>
    </div>
  );
}

export function RelatedLinks() {
  const links = [
    ["/paypal-reverse-fee-calculator/", "Reverse calculator"],
    ["/paypal-international-fee-calculator/", "International calculator"],
    ["/paypal-currency-conversion-calculator/", "Currency conversion"],
    ["/paypal-fees/us/", "US PayPal fees"],
    ["/methodology/", "Methodology"],
    ["/rate-log/", "Rate log"],
  ];
  return (
    <nav aria-label="Related calculators" className="rounded border border-line bg-white p-4 text-sm">
      <p className="font-semibold text-ink">Related tools</p>
      <div className="mt-3 grid gap-2 text-muted">
        {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </div>
    </nav>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded border border-line bg-paper p-4 text-sm text-muted">
      FeeClarity is an independent estimation tool and is not affiliated with PayPal. PayPal is a trademark of its owner. Actual fees may vary by country, account type, transaction type, funding source, currency conversion, merchant agreement, and other transaction details.
    </p>
  );
}

export function ExamplesTable() {
  const examples = ["50", "100", "250"].map((amount) => {
    const result = calculateFees({
      amount,
      mode: "receiving",
      accountCountry: "US",
      otherCountry: "US",
      transactionType: "commercial",
      paymentCurrency: "USD",
      receivingCurrency: "USD",
      forceInternational: false,
      currencyConversion: false,
    });

    return {
      amount: formatExampleCurrency(amount),
      fee: formatExampleCurrency(result.totalFees),
      net: formatExampleCurrency(result.netReceived),
    };
  });

  return (
    <div className="not-prose grid gap-4">
      <div className="overflow-x-auto rounded border border-line bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Illustrative US PayPal commercial payment examples</caption>
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3">Gross payment</th>
              <th className="px-4 py-3">Estimated fee</th>
              <th className="px-4 py-3">Estimated amount received</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((example) => (
              <tr key={example.amount} className="border-t border-line">
                <th scope="row" className="px-4 py-3 font-medium">{example.amount}</th>
                <td className="px-4 py-3">{example.fee}</td>
                <td className="px-4 py-3 font-medium text-mint">{example.net}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded border border-line bg-paper p-4 text-sm leading-6 text-muted">
        Illustrative examples only: US sender, US recipient, USD, commercial PayPal Checkout-style payment, no currency conversion, and the currently implemented published rule. The source was last verified {PAYPAL_SOURCE_US.lastVerified}. Actual fees can vary by account, product, funding source, and PayPal updates. Use the calculator above for your selected configuration.
      </p>
    </div>
  );
}

function formatExampleCurrency(value: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
}
