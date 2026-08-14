"use client";

import { useState, type ReactNode } from "react";
import { CoursePlayer } from "@/components/CoursePlayer";
import type { CourseDef } from "@/lib/courses/types";

/**
 * Curso completo (índice → lecciones → tareas) + pestaña de herramienta práctica.
 * Aplica el mismo estándar a toda el área Carrera, no solo bienestar.
 */
export function CourseWithTool({
  course,
  children,
  defaultMode = "curso",
}: {
  course: CourseDef;
  children: ReactNode;
  defaultMode?: "curso" | "practica";
}) {
  const [mode, setMode] = useState<"curso" | "practica">(defaultMode);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={mode === "curso" ? "btn-primary" : "btn-secondary"}
          onClick={() => setMode("curso")}
        >
          Curso
        </button>
        <button
          type="button"
          className={mode === "practica" ? "btn-primary" : "btn-secondary"}
          onClick={() => setMode("practica")}
        >
          {course.toolLabel || "Práctica / herramienta"}
        </button>
      </div>
      {mode === "curso" ? (
        <CoursePlayer
          course={course}
          onOpenTool={course.toolHref ? () => setMode("practica") : undefined}
        />
      ) : (
        children
      )}
    </div>
  );
}
