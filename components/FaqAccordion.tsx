"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line rounded border border-line bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        return (
          <section key={item.q}>
            <h3>
              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-5 text-left text-base font-semibold text-ink hover:bg-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-sky md:px-5 md:text-lg"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.q}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded border border-line text-mint" aria-hidden="true">
                  {isOpen ? "-" : "+"}
                </span>
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen} className="px-4 pb-5 text-base leading-7 text-muted md:px-5">
              <p>{item.a}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
