import { ArrowUpRight } from "lucide-react";

export default function ConnectionChip({
  name,
  onClick,
}: { name: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 min-h-14 bg-orange-50 ring-1 ring-orange-200/60 text-left hover:bg-orange-100/70 transition"
    >
      <span className="font-semibold leading-snug tracking-tight break-words">
        {name}
      </span>
      <ArrowUpRight className="shrink-0" size={16} />
    </button>
  );
}
