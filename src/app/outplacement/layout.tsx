import type { ReactNode } from "react";
import { OutplacementLayoutGate } from "@/components/OutplacementLayoutGate";

export default function OutplacementLayout({ children }: { children: ReactNode }) {
  return <OutplacementLayoutGate>{children}</OutplacementLayoutGate>;
}
