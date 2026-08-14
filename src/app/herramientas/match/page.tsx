import { redirect } from "next/navigation";

/** Alias legacy → encaje rápido gratis. */
export default function MatchPage() {
  redirect("/herramientas/calculadora");
}
