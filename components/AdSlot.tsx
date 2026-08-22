export function AdSlot({ label = "Advertisement" }: { label?: string }) {
  const displayLabel = label.toLowerCase().includes("advertisement") ? "Advertisement" : label;

  return (
    <aside className="ad-slot grid place-items-center rounded p-4 text-center text-xs uppercase tracking-wide text-muted" aria-label={displayLabel}>
      {displayLabel}
    </aside>
  );
}
