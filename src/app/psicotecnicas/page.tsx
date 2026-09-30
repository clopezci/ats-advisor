import { redirect } from "next/navigation";

/** Atajo corto → estudio de psicotécnicas. */
export default function PsicoShortcutPage() {
  redirect("/outplacement/psicotecnicas");
}
