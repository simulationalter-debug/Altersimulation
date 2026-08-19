import Link from "next/link";
import type { ReactNode } from "react";

export default function PageHeader({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
      <Link href={backHref} className="text-xl text-white/70">
        ←
      </Link>
      <p className="text-sm font-semibold">{title}</p>
      <div className="w-5 text-right">{right}</div>
    </div>
  );
}
