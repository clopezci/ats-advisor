import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi plan",
  description: "Marca qué necesitas o dictalo. Te guiamos un paso a la vez.",
};

export default function GuiaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
