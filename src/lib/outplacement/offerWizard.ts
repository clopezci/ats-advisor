import { formatCop } from "@/lib/channels/pricing";
import { estimateBand, type CityTier } from "@/lib/salary/bandsCo";

export type OfferWizardState = {
  bandId: string;
  city: CityTier;
  offerAmount: number;
  hasBonus: boolean;
  remoteDays: number;
  learningBudget: boolean;
  otherBenefits: string;
};

export function computeNegotiationNumbers(state: OfferWizardState) {
  const est = estimateBand(state.bandId, state.city);
  const floor = est.floor;
  const target = est.target;
  const stretch = est.stretch;
  const offer = state.offerAmount || 0;
  let verdict: "bajo" | "dentro" | "alto" | "sin_oferta" = "sin_oferta";
  if (offer > 0) {
    if (offer < floor * 0.95) verdict = "bajo";
    else if (offer > stretch * 1.05) verdict = "alto";
    else verdict = "dentro";
  }
  const counter =
    verdict === "bajo"
      ? Math.round((target + stretch) / 2)
      : verdict === "dentro"
        ? Math.min(stretch, Math.round(offer * 1.08))
        : target;

  return { ...est, floor, target, stretch, offer, verdict, counter };
}

export function buildScriptsCo(opts: {
  name: string;
  role: string;
  company: string;
  floor: number;
  target: number;
  stretch: number;
  offer: number;
  counter: number;
  verdict: string;
}) {
  const askRange =
    `Gracias por el proceso. Antes de hablar de un número concreto, ¿podrían compartirme la banda presupuestada para el rol de ${opts.role}? Así alineamos expectativas con la estructura de ${opts.company || "la empresa"}.`;

  const stateFloor =
    `Agradezco la oferta de ${formatCop(opts.offer)}. Con base en el alcance del rol y referencias de mercado en Colombia, mi piso es ${formatCop(opts.floor)} y mi meta ${formatCop(opts.target)}. ¿Hay espacio para acercarnos a ${formatCop(opts.counter)} en fijo, o compensar con bono, remoto o aprendizaje?`;

  const totalComp =
    `Si el fijo está cerrado cerca de ${formatCop(opts.offer)}, ¿podemos mejorar el paquete total? Por ejemplo: bono por objetivos, días de trabajo remoto, presupuesto de formación o equipo. Eso me permite aceptar con tranquilidad.`;

  const time =
    `Muchas gracias. Me entusiasma la oportunidad. ¿Me permiten 24–48 horas para revisar el paquete completo (contrato, beneficios y fecha de inicio) y responder formalmente?`;

  const declineSoft =
    `Agradezco mucho el proceso. En este momento mi piso es ${formatCop(opts.floor)} por el nivel de responsabilidad. Si en el futuro la banda se acerca, con gusto retomo la conversación.`;

  return { askRange, stateFloor, totalComp, time, declineSoft };
}

export const OFFER_STORAGE_KEY = "ats_offer_wizard";
