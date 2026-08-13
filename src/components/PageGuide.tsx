"use client";

import { usePathname } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { guideForPath } from "@/lib/flows/pageGuides";

export function PageGuide() {
  const pathname = usePathname() || "/";
  const guide = guideForPath(pathname);
  if (!guide) return null;

  return (
    <section className="bento-card space-y-2 mb-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.14em] muted">Para qué sirve y cómo usarla</p>
        <SpeakButton text={`${guide.what} ${guide.how}`} />
      </div>
      <p className="text-sm leading-relaxed">
        <strong>Para qué:</strong> {guide.what}
      </p>
      <p className="text-sm muted leading-relaxed">
        <strong>Cómo:</strong> {guide.how}
      </p>
    </section>
  );
}
