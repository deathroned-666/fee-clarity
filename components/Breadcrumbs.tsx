import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.href}-${item.label}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {isCurrent ? (
                <span aria-current="page" className="font-medium text-ink">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-ink">{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
