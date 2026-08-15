"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { guideForPath } from "@/lib/flows/pageGuides";
import { readFocusPath } from "@/lib/engagement/focusPath";

/**
 * Guía contextual — oculta en camino enfocado (menos ruido; el wizard ya explica).
 */
export function PageGuide() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);
  const guide = guideForPath(pathname);

  useEffect(() => {
    const focus = readFocusPath();
    const quiet =
      pathname === "/" ||
      pathname.startsWith("/outplacement/cuadernillo") ||
      (focus === "carrera" && pathname.startsWith("/outplacement")) ||
      (focus === "ats" && pathname.startsWith("/ats"));
    setShow(!quiet && Boolean(guide));
  }, [pathname, guide]);

  if (!show || !guide) return null;

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
