"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PrimaryNav({ items }: { items: string[][] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="w-full overflow-x-auto sm:w-auto">
      <div className="flex min-w-max items-center gap-1 rounded-xl border border-line bg-white/90 p-1 shadow-sm">
        {items.map(([label, href]) => {
          const active = pathname === href || (href !== "/paypal-fee-calculator/" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium no-underline transition duration-150 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky ${
                active
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

