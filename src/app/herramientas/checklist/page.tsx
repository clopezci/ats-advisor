"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CourseWithTool } from "@/components/CourseWithTool";
import { CareerUpsell } from "@/components/CareerUpsell";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";

const ITEMS = [
  "Una sola columna, sin tablas complejas",
  "Secciones: Contacto, Experiencia, Educación, Skills",
  "PDF texto seleccionable (no escaneo de imagen)",
  "Logros con números",
  "Keywords de la oferta sin inventar experiencia",
  "Sin texto blanco ni font 1px",
];

function ChecklistTool() {
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs muted">Gratis</p>
            <h1 className="text-xl font-semibold">Checklist CV ATS</h1>
          </div>
          <SpeakButton text={`Checklist. ${ITEMS.join(". ")}`} />
        </div>
        <p className="text-sm muted">Revisa esto antes de analizar o enviar. Luego pasa el analizador gratis.</p>
      </section>
      <ul className="bento-card space-y-2 text-sm">
        {ITEMS.map((i) => (
          <li key={i}>☐ {i}</li>
        ))}
      </ul>
      <Link href="/ats" className="btn-primary">
        Analizar mi CV
      </Link>
      {!paid ? (
        <CareerUpsell
          context="Para armar tu historia de logros, marca y CV con acompañamiento guiado"
          nextHref="/outplacement/cuadernillo"
        />
      ) : null}
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}

export default function ChecklistPage() {
  const course = toolCourseById("checklist-ats");
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
  }, []);

  if (!course || !paid) return <ChecklistTool />;
  return (
    <CourseWithTool course={course} defaultMode="practica">
      <ChecklistTool />
    </CourseWithTool>
  );
}
