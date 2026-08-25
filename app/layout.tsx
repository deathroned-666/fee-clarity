import type { Metadata } from "next";
import Link from "next/link";
import { PrimaryNav } from "@/components/PrimaryNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tryfeeclarity.com"),
  title: {
    default: "FeeClarity | Independent Payment Fee Calculators",
    template: "%s | FeeClarity",
  },
  description: "Independent payment-fee calculators and plain-English guides for PayPal fees, international charges, currency conversion, and seller costs.",
  applicationName: "FeeClarity",
  robots: { index: true, follow: true },
  icons: {
    icon: "/feeclarity-mark.png",
    apple: "/feeclarity-mark.png",
  },
};

const nav = [
  ["Calculator", "/paypal-fee-calculator/"],
  ["Reverse", "/paypal-reverse-fee-calculator/"],
  ["International", "/paypal-international-fee-calculator/"],
  ["Fees Guide", "/paypal-fees/"],
  ["Comparisons", "/paypal-vs-wise/"],
];

const footerResources = [
  ["About", "/about/"],
  ["Methodology", "/methodology/"],
  ["Rate Log", "/rate-log/"],
  ["Editorial Policy", "/editorial-policy/"],
  ["Sitemap", "/sitemap/"],
  ["Contact", "/contact/"],
];

const footerLegal = [
  ["Advertising Policy", "/advertising-policy/"],
  ["Privacy", "/privacy/"],
  ["Terms", "/terms/"],
];

const footerTools = [
  ["PayPal Fee Calculator", "/paypal-fee-calculator/"],
  ["Reverse PayPal Fee Calculator", "/paypal-reverse-fee-calculator/"],
  ["International PayPal Fee Calculator", "/paypal-international-fee-calculator/"],
  ["Currency Conversion Calculator", "/paypal-currency-conversion-calculator/"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-23N9EW294C" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-23N9EW294C');
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1324674549430217"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-2 no-underline" aria-label="FeeClarity home">
              <span className="grid size-9 place-items-center">
                <img src="/feeclarity-mark.png" alt="" className="size-full object-contain" />
              </span>
              <span className="font-semibold tracking-normal">FeeClarity</span>
            </Link>
            <PrimaryNav items={nav} />
          </div>
        </header>
        {children}
        <footer className="border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:grid-cols-[1.15fr_0.8fr_0.7fr_1fr] lg:py-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center">
                  <img src="/feeclarity-mark.png" alt="" className="size-full object-contain" />
                </span>
                <p className="text-base font-semibold text-ink">FeeClarity</p>
              </div>
              <p className="mt-3 leading-6">Transparent tools for understanding payment fees.</p>
              <p className="mt-2 leading-6">Know what you'll actually pay or receive.</p>
              <p className="mt-2 leading-6">Maintained by LaunchLab as an independent web utility project.</p>
            </div>

            <FooterNav title="Resources" label="Footer resources" links={footerResources} />
            <FooterNav title="Legal" label="Footer legal links" links={footerLegal} />
            <FooterNav title="Popular tools" label="Footer popular tools" links={footerTools} />
          </div>

          <div className="border-t border-line">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
              <p>&copy; {currentYear} FeeClarity. All rights reserved.</p>
              <p>Independent payment fee calculation tools.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterNav({ title, label, links }: { title: string; label: string; links: string[][] }) {
  return (
    <nav aria-label={label}>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {links.map(([linkLabel, href]) => (
          <li key={href}>
            <Link href={href} className="text-mint underline decoration-mint/30 underline-offset-4 transition hover:text-ink hover:decoration-ink">
              {linkLabel}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

