import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { formatVerificationDate, getLatestPaypalVerificationDate } from "@/components/HeroTrustRow";
import { PAYPAL_SOURCE_US } from "@/lib/fees/paypal-rules";
import type { FeeSource } from "@/lib/fees/types";

export function SectionHeading({ id, title, eyebrow, children }: { id?: string; title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-[780px]">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-mint">{eyebrow}</p> : null}
      <h2 id={id} className="mt-2 text-3xl font-bold leading-tight text-ink md:text-[32px]">{title}</h2>
      {children ? <div className="mt-3 text-base leading-7 text-muted">{children}</div> : null}
    </div>
  );
}

export function PageInfoCard({ title, intro, items, outro }: { title: string; intro: string; items: string[]; outro?: string }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 md:p-6">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted">{intro}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-base leading-7 text-muted">
            <CheckCircle2 size={16} className="mt-1 shrink-0 text-mint" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {outro ? <p className="mt-4 text-base leading-7 text-muted">{outro}</p> : null}
    </section>
  );
}

export function ImportantNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="rounded-lg border border-line bg-paper p-5 text-sm leading-6 text-muted md:p-6">
      <div className="flex gap-3">
        <Info size={18} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
        <div>
          <p className="font-semibold text-ink">{title}</p>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </aside>
  );
}

export function StepList({ title, steps }: { title: string; steps: string[] }) {
  return (
    <section>
      <SectionHeading title={title} />
      <ol className="mt-6 grid gap-4">
        {steps.map((step, index) => (
          <li key={step} className="grid gap-2 rounded border border-line bg-white p-4 sm:grid-cols-[40px_1fr]">
            <span className="grid size-9 place-items-center rounded border border-line bg-paper text-sm font-semibold text-mint" aria-hidden="true">{index + 1}</span>
            <span className="text-base leading-7 text-muted">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FeeComponentGrid({ items }: { items: { title: string; description: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <section key={item.title} className="rounded-lg border border-line bg-white p-5">
          <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
          <p className="mt-3 text-base leading-7 text-muted">{item.description}</p>
        </section>
      ))}
    </div>
  );
}

export function FormulaCard({ title, formula, children }: { title: string; formula: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 md:p-6">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-4 rounded border border-line bg-paper p-4 font-mono text-sm leading-7 text-ink">{formula}</p>
      <div className="mt-4 text-base leading-7 text-muted">{children}</div>
    </section>
  );
}

export function TrustStrip({ items, note, ariaLabel }: { items: string[]; note?: string; ariaLabel: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted" aria-label={ariaLabel}>
        {items.map((item) => (
          <li key={item} className="inline-flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-mint" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-3 text-sm leading-6 text-muted">{note}</p> : null}
    </div>
  );
}

export function SourceTransparencyCard({ source, market }: { source?: FeeSource; market?: string }) {
  const latestDate = source?.lastVerified ?? getLatestPaypalVerificationDate();
  const formatted = formatVerificationDate(latestDate);

  return (
    <section className="rounded-lg border border-line bg-paper p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded border border-line bg-white text-mint" aria-hidden="true">
            <ShieldCheck size={20} />
          </span>
          <div className="max-w-[760px]">
            <h2 className="text-2xl font-bold text-ink">Verified rate source</h2>
            <p className="mt-3 text-base leading-7 text-muted">
              FeeClarity uses published PayPal documentation where verified fee data is available. Unsupported markets are clearly identified rather than estimated using another country's fee schedule.
            </p>
            {market ? <p className="mt-2 text-sm font-medium text-ink">Applicable market: {market}</p> : null}
            <p className="mt-2 text-sm font-medium text-ink">Last verified: {formatted ?? latestDate ?? "See rate log"}</p>
          </div>
        </div>
        <nav aria-label="Source transparency links" className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-mint md:justify-end">
          <Link href="/methodology/" className="inline-flex items-center gap-1">Methodology <ArrowRight size={15} aria-hidden="true" /></Link>
          <Link href="/rate-log/" className="inline-flex items-center gap-1">Rate log <ArrowRight size={15} aria-hidden="true" /></Link>
          <a href={(source ?? PAYPAL_SOURCE_US).url} className="inline-flex items-center gap-1">Official source <ArrowRight size={15} aria-hidden="true" /></a>
        </nav>
      </div>
    </section>
  );
}

export function OnThisPage({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav aria-labelledby="on-this-page-heading" className="rounded-lg border border-line bg-paper p-5">
      <h2 id="on-this-page-heading" className="text-xl font-semibold text-ink">On this page</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-sm font-medium text-mint">{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
