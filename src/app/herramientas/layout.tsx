import type { ReactNode } from "react";
import { PaidToolGate } from "@/components/PaidToolGate";

export default function HerramientasLayout({ children }: { children: ReactNode }) {
  return <PaidToolGate>{children}</PaidToolGate>;
}
