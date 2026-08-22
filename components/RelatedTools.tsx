import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, CalculatorIcon, Globe2, ReceiptText, Repeat2 } from "lucide-react";

type ToolKey = "calculator" | "reverse" | "international" | "conversion" | "fees";

const tools: Record<ToolKey, { title: string; description: string; href: string; cta: string; icon: ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }> }> = {
  calculator: {
    title: "PayPal Fee Calculator",
    description: "Estimate PayPal fees and the amount you may actually receive.",
    href: "/paypal-fee-calculator/",
    cta: "Open calculator",
    icon: CalculatorIcon,
  },
  reverse: {
    title: "Reverse PayPal Fee Calculator",
    description: "Calculate how much to charge to receive a target amount after fees.",
    href: "/paypal-reverse-fee-calculator/",
    cta: "Calculate reverse fee",
    icon: Repeat2,
  },
  international: {
    title: "International PayPal Fee Calculator",
    description: "Separate processing fees, international charges, and conversion estimates.",
    href: "/paypal-international-fee-calculator/",
    cta: "Calculate international fee",
    icon: Globe2,
  },
  conversion: {
    title: "Currency Conversion Calculator",
    description: "Estimate cross-currency costs when payment and receiving currencies differ.",
    href: "/paypal-currency-conversion-calculator/",
    cta: "Check conversion",
    icon: CalculatorIcon,
  },
  fees: {
    title: "PayPal Fees Guide",
    description: "Understand processing rates, fixed fees, international fees, and conversion costs.",
    href: "/paypal-fees/",
    cta: "Read fees guide",
    icon: ReceiptText,
  },
};

const relatedByPage: Record<string, ToolKey[]> = {
  "/": ["reverse", "international", "conversion", "fees"],
  "/paypal-fee-calculator/": ["reverse", "international", "conversion", "fees"],
  "/paypal-reverse-fee-calculator/": ["calculator", "international", "fees"],
  "/paypal-international-fee-calculator/": ["calculator", "reverse", "conversion", "fees"],
  "/paypal-fees/": ["calculator", "reverse", "international", "conversion"],
};

export function RelatedTools({ currentPath }: { currentPath: string }) {
  const keys = relatedByPage[currentPath] ?? ["calculator", "reverse", "international", "conversion"];

  return (
    <section aria-labelledby="related-tools-heading">
      <div className="max-w-[760px]">
        <h2 id="related-tools-heading" className="text-3xl font-bold leading-tight text-ink md:text-[32px]">Related calculators and tools</h2>
        <p className="mt-3 text-base leading-7 text-muted">Continue with a focused tool that matches your next PayPal fee question.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {keys.map((key) => {
          const tool = tools[key];
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="group rounded-lg border border-line bg-white p-5 no-underline transition hover:border-mint hover:bg-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky">
              <Icon size={22} className="text-mint" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-ink">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted md:text-base md:leading-7">{tool.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint">
                {tool.cta} <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
